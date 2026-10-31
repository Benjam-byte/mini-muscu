import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";
import {
  createRandom,
  getHashOffset,
  pickColor,
  setFaceColors,
} from "./geometryBuilder";

export type GroundShadow = {
  x: number;
  z: number;
  radius: number;
};

const GRASS_COLOR_LIST = [0x7dbf5b, 0x76b655, 0x86c862, 0x70ad4f];
const GRASS_SHADOW_COLOR_LIST = [0x5e9a44, 0x578f40];
const SOIL_COLOR_LIST = [0x8a6a45, 0x7c5f3e];
const CLIFF_COLOR_LIST = [0x8b6b47, 0x7d603f];
const ROCK_COLOR_LIST = [0x6f6352, 0x7b6e5a, 0x655a4a];
const ISLAND_RING_COUNT = 10;
const SOIL_PATCH_RADIUS = 0.42;

export const getGroundHeight = (x: number, z: number): number => {
  const distance = Math.hypot(x, z);
  const mound = 0.22 * Math.max(0, 1 - distance / 1.1) ** 2;

  return mound + 0.05 * Math.sin(x * 1.3 + 0.7) * Math.cos(z * 1.1 - 0.4);
};

// Île flottante : maillage triangulaire hexagonal ramené à un disque, une
// falaise de terre, puis un cône de roche dessous. Les ombres des arbres sont
// peintes dans les couleurs du sol, sans ombre portée.
export const buildIslandGeometry = (
  radius: number,
  shadowList: GroundShadow[],
): BufferGeometry => {
  const random = createRandom(`island:${radius.toFixed(2)}`);
  const step = radius / ISLAND_RING_COUNT;
  const vertexByKey = new Map<string, Vector3>();
  const positionList: number[] = [];
  const faceColorList: number[] = [];

  const getVertex = (i: number, j: number): Vector3 | null => {
    const ring = Math.max(Math.abs(i), Math.abs(j), Math.abs(i + j));

    if (ring > ISLAND_RING_COUNT) {
      return null;
    }

    const key = `${i}:${j}`;
    const savedVertex = vertexByKey.get(key);

    if (savedVertex) {
      return savedVertex;
    }

    let x = (i + j / 2) * step;
    let z = j * (Math.sqrt(3) / 2) * step;

    if (ring > 0) {
      const scale = (ring * step) / Math.hypot(x, z);
      x *= scale;
      z *= scale;
    }

    if (ring > 0 && ring < ISLAND_RING_COUNT) {
      x += getHashOffset(i, j, 0, 4) * step * 0.25;
      z += getHashOffset(i, j, 0, 5) * step * 0.25;
    }

    const vertex = new Vector3(
      x,
      ring === ISLAND_RING_COUNT ? -0.04 : getGroundHeight(x, z),
      z,
    );
    vertexByKey.set(key, vertex);

    return vertex;
  };

  const pushFace = (
    firstVertex: Vector3,
    secondVertex: Vector3,
    thirdVertex: Vector3,
    color: number,
  ) => {
    positionList.push(
      firstVertex.x,
      firstVertex.y,
      firstVertex.z,
      secondVertex.x,
      secondVertex.y,
      secondVertex.z,
      thirdVertex.x,
      thirdVertex.y,
      thirdVertex.z,
    );
    faceColorList.push(color);
  };

  const getGrassColor = (first: Vector3, second: Vector3, third: Vector3) => {
    const centerX = (first.x + second.x + third.x) / 3;
    const centerZ = (first.z + second.z + third.z) / 3;

    if (Math.hypot(centerX, centerZ) < SOIL_PATCH_RADIUS) {
      return pickColor(SOIL_COLOR_LIST, random);
    }

    const isShadowed = shadowList.some(
      (shadow) =>
        Math.hypot(centerX - shadow.x, centerZ - shadow.z) < shadow.radius,
    );

    return pickColor(
      isShadowed ? GRASS_SHADOW_COLOR_LIST : GRASS_COLOR_LIST,
      random,
    );
  };

  for (let i = -ISLAND_RING_COUNT; i <= ISLAND_RING_COUNT; i++) {
    for (let j = -ISLAND_RING_COUNT; j <= ISLAND_RING_COUNT; j++) {
      const origin = getVertex(i, j);
      const right = getVertex(i + 1, j);
      const top = getVertex(i, j + 1);
      const topRight = getVertex(i + 1, j + 1);

      if (origin && right && top) {
        pushFace(origin, top, right, getGrassColor(origin, top, right));
      }

      if (right && top && topRight) {
        pushFace(right, top, topRight, getGrassColor(right, top, topRight));
      }
    }
  }

  const borderVertexList = [...vertexByKey.entries()]
    .filter(([key]) => {
      const [i, j] = key.split(":").map(Number);
      return (
        Math.max(Math.abs(i), Math.abs(j), Math.abs(i + j)) ===
        ISLAND_RING_COUNT
      );
    })
    .map(([, vertex]) => vertex)
    .sort(
      (firstVertex, secondVertex) =>
        Math.atan2(firstVertex.z, firstVertex.x) -
        Math.atan2(secondVertex.z, secondVertex.x),
    );
  const cliffBottomList = borderVertexList.map(
    (vertex) => new Vector3(vertex.x * 0.92, -0.45, vertex.z * 0.92),
  );
  const rockMiddleList = borderVertexList.map(
    (vertex, index) =>
      new Vector3(
        vertex.x * (0.6 + getHashOffset(index, 0, 0, 6) * 0.06),
        -0.45 - radius * 0.3,
        vertex.z * (0.6 + getHashOffset(index, 0, 0, 7) * 0.06),
      ),
  );
  const rockApex = new Vector3(0, -0.45 - radius * 0.75, 0);

  for (let index = 0; index < borderVertexList.length; index++) {
    const nextIndex = (index + 1) % borderVertexList.length;
    const cliffColor = pickColor(CLIFF_COLOR_LIST, random);
    const rockColor = pickColor(ROCK_COLOR_LIST, random);

    pushFace(
      borderVertexList[index],
      borderVertexList[nextIndex],
      cliffBottomList[index],
      cliffColor,
    );
    pushFace(
      borderVertexList[nextIndex],
      cliffBottomList[nextIndex],
      cliffBottomList[index],
      cliffColor,
    );
    pushFace(
      cliffBottomList[index],
      cliffBottomList[nextIndex],
      rockMiddleList[index],
      rockColor,
    );
    pushFace(
      cliffBottomList[nextIndex],
      rockMiddleList[nextIndex],
      rockMiddleList[index],
      rockColor,
    );
    pushFace(
      rockMiddleList[index],
      rockMiddleList[nextIndex],
      rockApex,
      pickColor(ROCK_COLOR_LIST, random),
    );
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(positionList, 3),
  );
  setFaceColors(geometry, random, (faceIndex) => faceColorList[faceIndex]);
  geometry.computeVertexNormals();

  return geometry;
};
