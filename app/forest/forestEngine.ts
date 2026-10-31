import {
  BufferGeometry,
  CanvasTexture,
  DirectionalLight,
  Float32BufferAttribute,
  Fog,
  HemisphereLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { ForestSceneData, ForestScenePlant } from "../forest";
import { createRandom, lerp } from "./geometryBuilder";
import {
  buildIslandGeometry,
  getGroundHeight,
  type GroundShadow,
} from "./islandModel";
import { buildPlantGeometry } from "./plantModels";

export type ForestMode = "home" | "workout";

type Tween = {
  from: number;
  to: number;
  startTime: number | null;
  duration: number;
};

type ModeSetting = {
  hemisphereSkyColor: number;
  hemisphereGroundColor: number;
  hemisphereIntensity: number;
  sunColor: number;
  sunIntensity: number;
  sunPosition: [number, number, number];
  fogColor: number;
};

type CameraFraming = {
  distance: number;
  elevation: number;
  targetY: number;
};

const FRAME_DURATION = 1000 / 30;
const MAX_PIXEL_RATIO = 1.5;
const AUTO_ORBIT_SPEED = 0.07; // rad/s
const DRAG_ROTATION_SPEED = 0.01; // rad/px
const CAMERA_STEP_ANGLE = 0.75;
const CAMERA_TWEEN_DURATION = 1200;
const GROWTH_TWEEN_DURATION = 1600;
const GROWTH_TWEEN_DELAY = 350;
const MIN_ISLAND_RADIUS = 3.2;
const MIN_HORIZONTAL_HALF_FOV = (20 * Math.PI) / 180;
const MAX_VERTICAL_FOV = 80;
// En séance, l'image est décalée vers le haut (comme un objectif à
// décentrement) : l'île passe au-dessus de la carte d'exercice.
const WORKOUT_VIEW_SHIFT = 0.27;
const WORKOUT_ISLAND_WIDTH_RATIO = 1;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const FIREFLY_MAX_COUNT = 18;

const MODE_SETTING_BY_MODE: Record<ForestMode, ModeSetting> = {
  home: {
    hemisphereSkyColor: 0xf4fbff,
    hemisphereGroundColor: 0x5d7a3c,
    hemisphereIntensity: 1.7,
    sunColor: 0xfff1d6,
    sunIntensity: 2.4,
    sunPosition: [4, 8, 5],
    fogColor: 0xd4ecfa,
  },
  workout: {
    hemisphereSkyColor: 0x9db3e0,
    hemisphereGroundColor: 0x2e3a52,
    hemisphereIntensity: 1.2,
    sunColor: 0xffb27a,
    sunIntensity: 1.8,
    sunPosition: [-5, 3.5, 4],
    fogColor: 0x18223a,
  },
};

const easeInOutCubic = (progress: number) =>
  progress < 0.5
    ? 4 * progress ** 3
    : 1 - (-2 * progress + 2) ** 3 / 2;

const easeOutBack = (progress: number) => {
  const overshoot = 1.4;
  return 1 + (overshoot + 1) * (progress - 1) ** 3 + overshoot * (progress - 1) ** 2;
};

// Disposition en phyllotaxie autour de la clairière centrale : positions
// stables et naturelles, la forêt s'étend vers l'extérieur au fil des mois.
const getPlantedPosition = (index: number) => {
  const distance = 1.15 * Math.sqrt(index + 2.6);
  const angle = index * GOLDEN_ANGLE + 0.6;

  return { x: Math.cos(angle) * distance, z: Math.sin(angle) * distance };
};

const getPlantedSignature = (plantedList: ForestScenePlant[]) =>
  plantedList
    .map(
      (plant) => `${plant.monthKey}:${plant.stageIndex}:${plant.height.toFixed(3)}`,
    )
    .join("|");

const createFireflyTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;

  return texture;
};

export class ForestEngine {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(40, 1, 0.1, 100);
  private readonly material = new MeshLambertMaterial({
    vertexColors: true,
    flatShading: true,
  });
  private readonly forestMesh = new Mesh(new BufferGeometry(), this.material);
  private readonly currentPlantMesh = new Mesh(
    new BufferGeometry(),
    this.material,
  );
  private readonly fireflyGeometry = new BufferGeometry();
  private readonly fireflyList: {
    orbitRadius: number;
    height: number;
    speed: number;
    phase: number;
  }[] = [];
  private readonly hemisphereLight = new HemisphereLight();
  private readonly sunLight = new DirectionalLight();
  private readonly fog = new Fog(0xffffff, 10, 30);
  private readonly cameraTarget = new Vector3();
  private readonly resizeObserver: ResizeObserver;
  private readonly reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  private container: HTMLElement | null = null;
  private mode: ForestMode = "home";
  private plantedSignature: string | null = null;
  private currentPlantKey = "";
  private currentPlantMonthKey = "";
  private targetPlantHeight = 0;
  private displayedPlantHeight = 0;
  private growthTween: Tween | null = null;
  private islandRadius = MIN_ISLAND_RADIUS;
  private azimuth = 0.8;
  private cameraTween: Tween | null = null;
  private cameraStep = 0;
  private fireflyCount = 0;
  private animationFrameId = 0;
  private lastFrameTime = 0;
  private isDragging = false;
  private dragPointerX = 0;
  private isContextLost = false;

  constructor() {
    this.renderer = new WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      alpha: true,
      powerPreference: "low-power",
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO),
    );
    this.renderer.setClearColor(0x000000, 0);

    const canvas = this.renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.touchAction = "pan-y";

    this.scene.fog = this.fog;
    this.scene.add(this.hemisphereLight, this.sunLight);
    this.scene.add(this.forestMesh, this.currentPlantMesh);

    this.fireflyGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(new Float32Array(FIREFLY_MAX_COUNT * 3), 3),
    );
    this.fireflyGeometry.setDrawRange(0, 0);
    const fireflyRandom = createRandom("fireflies");

    for (let index = 0; index < FIREFLY_MAX_COUNT; index++) {
      this.fireflyList.push({
        orbitRadius: 0.45 + fireflyRandom() * 0.6,
        height: 0.2 + fireflyRandom() * 1.1,
        speed: (0.25 + fireflyRandom() * 0.35) * (index % 2 === 0 ? 1 : -1),
        phase: fireflyRandom() * Math.PI * 2,
      });
    }

    const fireflies = new Points(
      this.fireflyGeometry,
      new PointsMaterial({
        color: 0xffd84d,
        size: 0.16,
        map: createFireflyTexture(),
        transparent: true,
        depthWrite: false,
      }),
    );
    fireflies.frustumCulled = false;
    this.scene.add(fireflies);

    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
      this.requestFrame();
    });

    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      this.isContextLost = true;
      this.cancelFrame();
    });
    canvas.addEventListener("webglcontextrestored", () => {
      this.isContextLost = false;
      this.requestFrame();
    });
    canvas.addEventListener("pointerdown", (event) => {
      if (this.mode !== "home") {
        return;
      }

      this.isDragging = true;
      this.dragPointerX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (!this.isDragging) {
        return;
      }

      this.azimuth -= (event.clientX - this.dragPointerX) * DRAG_ROTATION_SPEED;
      this.dragPointerX = event.clientX;
      this.requestFrame();
    });
    const stopDragging = () => {
      this.isDragging = false;
    };
    canvas.addEventListener("pointerup", stopDragging);
    canvas.addEventListener("pointercancel", stopDragging);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.cancelFrame();
      } else {
        this.requestFrame();
      }
    });
    this.reducedMotionQuery.addEventListener("change", () =>
      this.requestFrame(),
    );
  }

  attach(container: HTMLElement, mode: ForestMode) {
    if (this.container && this.container !== container) {
      this.detach(this.container);
    }

    this.container = container;
    this.mode = mode;
    this.applyModeSetting();
    this.resize();

    if (this.growthTween && this.growthTween.startTime === null) {
      this.growthTween.startTime = performance.now() + GROWTH_TWEEN_DELAY;
    }

    // Première image rendue avant l'insertion : pas de flash au changement
    // d'écran.
    this.update(performance.now(), 0);
    this.renderer.render(this.scene, this.camera);
    container.appendChild(this.renderer.domElement);
    this.resizeObserver.observe(container);
    this.requestFrame();
  }

  detach(container: HTMLElement) {
    if (this.container !== container) {
      return;
    }

    this.resizeObserver.disconnect();
    this.renderer.domElement.remove();
    this.container = null;
    this.isDragging = false;
    this.cancelFrame();
  }

  setData(sceneData: ForestSceneData) {
    const plantedSignature = getPlantedSignature(sceneData.plantedList);

    if (plantedSignature !== this.plantedSignature) {
      this.plantedSignature = plantedSignature;
      this.rebuildForest(sceneData.plantedList);
    }

    const { currentPlant } = sceneData;
    const currentPlantKey = `${currentPlant.monthKey}:${currentPlant.stageIndex}`;

    if (currentPlantKey !== this.currentPlantKey) {
      this.currentPlantKey = currentPlantKey;
      this.currentPlantMesh.geometry.dispose();
      this.currentPlantMesh.geometry = buildPlantGeometry(
        currentPlant.species,
        currentPlant.stageIndex,
        currentPlant.monthKey,
      );
    }

    const isSameMonth = currentPlant.monthKey === this.currentPlantMonthKey;

    if (isSameMonth && currentPlant.height > this.targetPlantHeight + 0.001) {
      this.growthTween = {
        from: this.displayedPlantHeight,
        to: currentPlant.height,
        startTime: this.container
          ? performance.now() + GROWTH_TWEEN_DELAY
          : null,
        duration: GROWTH_TWEEN_DURATION,
      };
    } else if (!isSameMonth || currentPlant.height < this.targetPlantHeight) {
      this.growthTween = null;
      this.displayedPlantHeight = currentPlant.height;
    }

    this.currentPlantMonthKey = currentPlant.monthKey;
    this.targetPlantHeight = currentPlant.height;
    this.currentPlantMesh.position.set(0, getGroundHeight(0, 0) - 0.02, 0);
    this.currentPlantMesh.scale.setScalar(this.displayedPlantHeight);
    this.fireflyCount =
      sceneData.growthMultiplier >= 2
        ? FIREFLY_MAX_COUNT
        : sceneData.growthMultiplier > 1
          ? 8
          : 0;
    this.fireflyGeometry.setDrawRange(0, this.fireflyCount);
    this.requestFrame();
  }

  setCameraStep(cameraStep: number) {
    if (cameraStep === this.cameraStep) {
      return;
    }

    this.cameraStep = cameraStep;
    this.cameraTween = {
      from: this.azimuth,
      to: this.azimuth + CAMERA_STEP_ANGLE,
      startTime: performance.now(),
      duration: CAMERA_TWEEN_DURATION,
    };
    this.requestFrame();
  }

  private rebuildForest(plantedList: ForestScenePlant[]) {
    const shadowList: GroundShadow[] = [];
    const plantGeometryList: BufferGeometry[] = [];
    let farthestDistance = 0;

    plantedList.forEach((plant, index) => {
      const { x, z } = getPlantedPosition(index);
      const geometry = buildPlantGeometry(
        plant.species,
        plant.stageIndex,
        plant.monthKey,
      );
      const rotationRandom = createRandom(`rotation:${plant.monthKey}`);

      geometry.scale(plant.height, plant.height, plant.height);
      geometry.rotateY(rotationRandom() * Math.PI * 2);
      geometry.translate(x, getGroundHeight(x, z) - 0.03, z);
      plantGeometryList.push(geometry);
      shadowList.push({ x, z, radius: 0.15 + plant.height * 0.35 });
      farthestDistance = Math.max(farthestDistance, Math.hypot(x, z));
    });

    this.islandRadius = Math.max(MIN_ISLAND_RADIUS, farthestDistance + 1.3);
    const islandGeometry = buildIslandGeometry(this.islandRadius, shadowList);
    const forestGeometry =
      mergeGeometries([islandGeometry, ...plantGeometryList]) ?? islandGeometry;

    if (forestGeometry !== islandGeometry) {
      islandGeometry.dispose();
    }

    for (const geometry of plantGeometryList) {
      geometry.dispose();
    }

    this.forestMesh.geometry.dispose();
    this.forestMesh.geometry = forestGeometry;
  }

  private applyModeSetting() {
    const modeSetting = MODE_SETTING_BY_MODE[this.mode];

    this.hemisphereLight.color.setHex(modeSetting.hemisphereSkyColor);
    this.hemisphereLight.groundColor.setHex(modeSetting.hemisphereGroundColor);
    this.hemisphereLight.intensity = modeSetting.hemisphereIntensity;
    this.sunLight.color.setHex(modeSetting.sunColor);
    this.sunLight.intensity = modeSetting.sunIntensity;
    this.sunLight.position.set(...modeSetting.sunPosition);
    this.fog.color.setHex(modeSetting.fogColor);
  }

  private resize() {
    if (!this.container) {
      return;
    }

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (width === 0 || height === 0) {
      return;
    }

    const aspect = width / height;

    this.renderer.setSize(width, height, false);
    this.camera.aspect = aspect;
    // Le champ de vision de three.js est vertical : en portrait, on l'élargit
    // pour garder au moins 40° à l'horizontale, sinon la vue se réduit à une
    // fente et tout paraît zoomé.
    this.camera.fov = Math.min(
      MAX_VERTICAL_FOV,
      Math.max(
        40,
        (2 * Math.atan(Math.tan(MIN_HORIZONTAL_HALF_FOV) / aspect) * 180) /
          Math.PI,
      ),
    );

    if (this.mode === "workout") {
      this.camera.setViewOffset(
        width,
        height,
        0,
        height * WORKOUT_VIEW_SHIFT,
        width,
        height,
      );
    } else {
      this.camera.clearViewOffset();
    }

    this.camera.updateProjectionMatrix();
  }

  private isAnimating() {
    return (
      this.cameraTween !== null ||
      this.growthTween !== null ||
      (this.mode === "home" && !this.reducedMotionQuery.matches)
    );
  }

  private requestFrame() {
    if (
      this.animationFrameId ||
      !this.container ||
      document.hidden ||
      this.isContextLost
    ) {
      return;
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  private cancelFrame() {
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = 0;
    this.lastFrameTime = 0;
  }

  private readonly tick = (time: number) => {
    this.animationFrameId = 0;

    // 30 images/s suffisent pour une orbite lente et ménagent la batterie.
    if (this.lastFrameTime && time - this.lastFrameTime < FRAME_DURATION - 2) {
      this.requestFrame();
      return;
    }

    const deltaSeconds = this.lastFrameTime
      ? Math.min(0.1, (time - this.lastFrameTime) / 1000)
      : 0;
    this.lastFrameTime = time;
    this.update(time, deltaSeconds);
    this.renderer.render(this.scene, this.camera);

    if (this.isAnimating()) {
      this.requestFrame();
    } else {
      this.lastFrameTime = 0;
    }
  };

  private getTweenProgress(tween: Tween, time: number) {
    if (tween.startTime === null || time < tween.startTime) {
      return 0;
    }

    return Math.min(1, (time - tween.startTime) / tween.duration);
  }

  private update(time: number, deltaSeconds: number) {
    if (
      this.mode === "home" &&
      !this.isDragging &&
      !this.reducedMotionQuery.matches
    ) {
      this.azimuth += AUTO_ORBIT_SPEED * deltaSeconds;
    }

    if (this.cameraTween) {
      const progress = this.getTweenProgress(this.cameraTween, time);
      this.azimuth =
        this.cameraTween.from +
        (this.cameraTween.to - this.cameraTween.from) *
          easeInOutCubic(progress);

      if (progress >= 1) {
        this.cameraTween = null;
      }
    }

    if (this.growthTween) {
      const progress = this.getTweenProgress(this.growthTween, time);
      this.displayedPlantHeight =
        this.growthTween.from +
        (this.growthTween.to - this.growthTween.from) * easeOutBack(progress);

      if (progress >= 1) {
        this.displayedPlantHeight = this.growthTween.to;
        this.growthTween = null;
      }

      this.currentPlantMesh.scale.setScalar(this.displayedPlantHeight);
    }

    this.updateFireflies(time / 1000);
    this.updateCamera();
  }

  private updateFireflies(timeSeconds: number) {
    if (this.fireflyCount === 0) {
      return;
    }

    const positionAttribute = this.fireflyGeometry.getAttribute("position");
    const groundHeight = getGroundHeight(0, 0);
    const orbitScale = Math.max(0.8, this.displayedPlantHeight);

    for (let index = 0; index < this.fireflyCount; index++) {
      const firefly = this.fireflyList[index];
      const angle = firefly.phase + timeSeconds * firefly.speed;

      positionAttribute.setXYZ(
        index,
        Math.cos(angle) * firefly.orbitRadius * orbitScale,
        groundHeight +
          firefly.height * orbitScale +
          Math.sin(timeSeconds * 1.7 + firefly.phase) * 0.08,
        Math.sin(angle) * firefly.orbitRadius * orbitScale,
      );
    }

    positionAttribute.needsUpdate = true;
  }

  private getCameraFraming(): CameraFraming {
    if (this.mode === "workout") {
      // Toute l'île tient dans la largeur, quelle que soit la taille de la
      // forêt.
      return {
        distance: Math.max(
          9,
          this.islandRadius /
            Math.tan(MIN_HORIZONTAL_HALF_FOV) /
            WORKOUT_ISLAND_WIDTH_RATIO,
        ),
        elevation: 0.45,
        targetY: 0.4,
      };
    }

    // Sur l'accueil, la caméra s'approche en plongée d'une graine ou d'une
    // pousse (les arbres voisins ne la cachent pas), puis recule à mesure que
    // l'arbre grandit, en suivant l'animation de pousse.
    const plantFocus = Math.min(1, this.displayedPlantHeight);

    return {
      distance:
        Math.min(3 + this.islandRadius * 1.8, 14) *
        1.2 *
        lerp(0.42, 1, plantFocus),
      elevation: lerp(0.75, 0.42, plantFocus),
      targetY: lerp(0.2, 0.55, plantFocus),
    };
  }

  private updateCamera() {
    const { distance, elevation, targetY } = this.getCameraFraming();
    const horizontalDistance = Math.cos(elevation) * distance;

    this.cameraTarget.set(0, targetY, 0);
    this.camera.position.set(
      Math.cos(this.azimuth) * horizontalDistance,
      targetY + Math.sin(elevation) * distance,
      Math.sin(this.azimuth) * horizontalDistance,
    );
    this.camera.lookAt(this.cameraTarget);
    this.fog.near = distance * 0.9;
    this.fog.far = distance * 2.6;
  }
}

let forestEngine: ForestEngine | null | undefined;

// Un seul renderer pour toute l'app : les écrans se passent le même canvas
// au lieu de recréer un contexte WebGL.
export const getForestEngine = (): ForestEngine | null => {
  if (forestEngine === undefined) {
    try {
      forestEngine = new ForestEngine();
    } catch (error) {
      console.error("Unable to create forest scene", error);
      forestEngine = null;
    }
  }

  return forestEngine;
};
