import {
  BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Euler,
  Float32BufferAttribute,
  IcosahedronGeometry,
  Matrix4,
  Quaternion,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type Random = () => number;
export type Vector3Tuple = [number, number, number];

export type PartOptions = {
  position?: Vector3Tuple;
  rotation?: Vector3Tuple;
  quaternion?: Quaternion;
  scale?: Vector3Tuple;
  jitter?: number;
  getFaceColor?: (faceCenterY: number) => number | null;
};

// Volume de feuillage sur lequel on peut poser fruits, fleurs ou boules.
export type Crown = {
  position: Vector3Tuple;
  radius: number;
  verticalRadius: number;
};

export const UP_VECTOR = new Vector3(0, 1, 0);

const temporaryColor = new Color();
const temporaryEuler = new Euler();
const temporaryMatrix = new Matrix4();
const temporaryQuaternion = new Quaternion();

export const lerp = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

// mulberry32 : chaque arbre garde le même aspect d'un rendu à l'autre.
export const createRandom = (seedText: string): Random => {
  let seed = 0;

  for (let index = 0; index < seedText.length; index++) {
    seed = (Math.imul(31, seed) + seedText.charCodeAt(index)) | 0;
  }

  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const getHashOffset = (
  x: number,
  y: number,
  z: number,
  salt: number,
) => {
  const value =
    Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + salt * 19.19) * 43758.5453;

  return (value - Math.floor(value)) * 2 - 1;
};

export const pickColor = (colorList: number[], random: Random) =>
  colorList[Math.floor(random() * colorList.length)];

// Une couleur par triangle, légèrement nuancée : rendu low-poly à facettes.
export const setFaceColors = (
  geometry: BufferGeometry,
  random: Random,
  getFaceColor: (faceIndex: number) => number,
) => {
  const vertexCount = geometry.getAttribute("position").count;
  const colorArray = new Float32Array(vertexCount * 3);

  for (let vertex = 0; vertex < vertexCount; vertex += 3) {
    const shade = 0.9 + random() * 0.2;
    temporaryColor.setHex(getFaceColor(vertex / 3));

    for (let corner = 0; corner < 3; corner++) {
      const offset = (vertex + corner) * 3;
      colorArray[offset] = temporaryColor.r * shade;
      colorArray[offset + 1] = temporaryColor.g * shade;
      colorArray[offset + 2] = temporaryColor.b * shade;
    }
  }

  geometry.setAttribute("color", new Float32BufferAttribute(colorArray, 3));
};

// Décale les sommets selon leur position arrondie : deux sommets confondus
// reçoivent le même décalage, la surface reste donc fermée.
const jitterPositions = (geometry: BufferGeometry, amount: number) => {
  const positionAttribute = geometry.getAttribute("position");

  for (let index = 0; index < positionAttribute.count; index++) {
    const x = Math.round(positionAttribute.getX(index) * 1000) / 1000;
    const y = Math.round(positionAttribute.getY(index) * 1000) / 1000;
    const z = Math.round(positionAttribute.getZ(index) * 1000) / 1000;

    positionAttribute.setXYZ(
      index,
      x + amount * getHashOffset(x, y, z, 1),
      y + amount * getHashOffset(x, y, z, 2),
      z + amount * getHashOffset(x, y, z, 3),
    );
  }
};

// Assemble des primitives colorées en une seule géométrie non indexée.
export class GeometryBuilder {
  private readonly partList: BufferGeometry[] = [];

  constructor(readonly random: Random) {}

  add(geometry: BufferGeometry, colorList: number[], options: PartOptions = {}) {
    const part = geometry.index ? geometry.toNonIndexed() : geometry;

    if (part !== geometry) {
      geometry.dispose();
    }

    part.deleteAttribute("uv");

    if (options.jitter) {
      jitterPositions(part, options.jitter);
    }

    const positionAttribute = part.getAttribute("position");

    setFaceColors(part, this.random, (faceIndex) => {
      const vertex = faceIndex * 3;
      const faceCenterY =
        (positionAttribute.getY(vertex) +
          positionAttribute.getY(vertex + 1) +
          positionAttribute.getY(vertex + 2)) /
        3;

      return (
        options.getFaceColor?.(faceCenterY) ??
        pickColor(colorList, this.random)
      );
    });

    if (options.quaternion) {
      temporaryQuaternion.copy(options.quaternion);
    } else {
      temporaryEuler.set(...(options.rotation ?? [0, 0, 0]));
      temporaryQuaternion.setFromEuler(temporaryEuler);
    }

    temporaryMatrix.compose(
      new Vector3(...(options.position ?? [0, 0, 0])),
      temporaryQuaternion,
      new Vector3(...(options.scale ?? [1, 1, 1])),
    );
    part.applyMatrix4(temporaryMatrix);
    this.partList.push(part);
  }

  addDot(color: number, position: Vector3Tuple, radius: number) {
    this.add(new IcosahedronGeometry(radius, 0), [color], { position });
  }

  // Cylindre conique tendu entre deux points : tronc, branche, tige.
  addLimb(
    from: Vector3Tuple,
    to: Vector3Tuple,
    fromRadius: number,
    toRadius: number,
    colorList: number[],
    heightSegments = 1,
  ) {
    const start = new Vector3(...from);
    const direction = new Vector3(...to).sub(start);
    const length = direction.length();

    this.add(
      new CylinderGeometry(toRadius, fromRadius, length, 6, heightSegments),
      colorList,
      {
        position: start.addScaledVector(direction, 0.5).toArray() as Vector3Tuple,
        quaternion: new Quaternion().setFromUnitVectors(
          UP_VECTOR,
          direction.normalize(),
        ),
      },
    );
  }

  addBlob(
    position: Vector3Tuple,
    radius: number,
    colorList: number[],
    options: {
      detail?: number;
      scale?: Vector3Tuple;
      rotation?: Vector3Tuple;
      jitter?: number;
    } = {},
  ): Crown {
    const scale = options.scale ?? [1, 1, 1];

    this.add(new IcosahedronGeometry(radius, options.detail ?? 0), colorList, {
      position,
      scale,
      rotation: options.rotation ?? [
        this.random() * Math.PI,
        this.random() * Math.PI,
        0,
      ],
      jitter: options.jitter ?? radius * 0.12,
    });

    return {
      position,
      radius: (radius * (scale[0] + scale[2])) / 2,
      verticalRadius: radius * scale[1],
    };
  }

  // Feuille fine (palme, aiguille, brin) aplatie à l'horizontale, qui part
  // de `base` dans la direction donnée. Renvoie le bout de la feuille.
  addLeaf(
    base: Vector3Tuple,
    direction: Vector3Tuple,
    length: number,
    width: number,
    colorList: number[],
  ): Vector3Tuple {
    const leafDirection = new Vector3(...direction).normalize();
    const sideAxis = new Vector3().crossVectors(leafDirection, UP_VECTOR);

    if (sideAxis.lengthSq() < 1e-6) {
      sideAxis.set(1, 0, 0);
    }

    sideAxis.normalize();
    const normalAxis = new Vector3().crossVectors(sideAxis, leafDirection);
    const basisMatrix = new Matrix4().makeBasis(
      sideAxis,
      leafDirection,
      normalAxis,
    );
    const start = new Vector3(...base);

    this.add(new ConeGeometry(width, length, 3), colorList, {
      position: start
        .clone()
        .addScaledVector(leafDirection, length / 2)
        .toArray() as Vector3Tuple,
      quaternion: new Quaternion().setFromRotationMatrix(basisMatrix),
      scale: [1, 1, 0.25],
    });

    return start.addScaledVector(leafDirection, length).toArray() as Vector3Tuple;
  }

  // Fruits, fleurs, pompons ou boules posés sur la surface des feuillages.
  addDotsOnCrowns(
    crownList: Crown[],
    count: number,
    colorList: number[],
    radius: number,
  ) {
    for (let index = 0; index < count; index++) {
      const crown = crownList[index % crownList.length];
      const angle = this.random() * Math.PI * 2;
      const height = this.random() * 1.1 - 0.3;
      const horizontalLength = Math.sqrt(Math.max(0, 1 - height * height));

      this.addDot(
        pickColor(colorList, this.random),
        [
          crown.position[0] + Math.cos(angle) * horizontalLength * crown.radius,
          crown.position[1] + height * crown.verticalRadius * 0.9,
          crown.position[2] + Math.sin(angle) * horizontalLength * crown.radius,
        ],
        radius,
      );
    }
  }

  build(): BufferGeometry {
    const geometry = mergeGeometries(this.partList) ?? new BufferGeometry();

    for (const part of this.partList) {
      part.dispose();
    }

    return geometry;
  }
}
