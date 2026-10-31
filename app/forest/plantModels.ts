import {
  ConeGeometry,
  DodecahedronGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
  Vector3,
  type BufferGeometry,
} from "three";
import type { PlantModel, PlantSpecies } from "../forest";
import {
  GeometryBuilder,
  createRandom,
  lerp,
  type Crown,
  type Vector3Tuple,
} from "./geometryBuilder";

// maturity : 0 = petit arbre, 1 = arbre majestueux. accentLevel : fruits,
// fleurs ou décorations en plus pour les deux derniers paliers.
type TreeGrowth = {
  maturity: number;
  accentLevel: number;
};

type TreeModelBuilder = (
  builder: GeometryBuilder,
  species: PlantSpecies,
  treeGrowth: TreeGrowth,
) => void;

type SeedKind = "acorn" | "coconut" | "pineCone" | "samara" | "pit";
type SproutKind = "leafy" | "needle" | "palm" | "cactus";

// Paliers : 0 graine, 1 pousse, 2 petit arbre, puis l'arbre grandit.
const MATURITY_BY_STAGE = [0, 0, 0, 0.35, 0.6, 0.8, 1];
const ACCENT_LEVEL_BY_STAGE = [0, 0, 0, 0, 0, 1, 2];

const SPROUT_COLOR_LIST = [0x7cc552, 0x6db648, 0x86cc5c];
const STEM_COLOR_LIST = [0x5f9e3a];
const SOIL_COLOR_LIST = [0x5e4630, 0x544029];
const SEED_COLOR_LIST = [0xd9b98a, 0xc9a670];
const COCONUT_COLOR_LIST = [0x7a5230, 0x6b4526, 0x86603a];
const PINE_CONE_COLOR_LIST = [0xa8703a, 0x96622f, 0x8a5a2b];
const BIRCH_BARK_COLOR_LIST = [0xece7dc, 0xece7dc, 0xe0dacd, 0x3b3631];
const CHRISTMAS_ORNAMENT_GOLD = 0xf2c94c;
const STAR_COLOR = 0xffd84d;

const SEED_KIND_BY_MODEL: Record<PlantModel, SeedKind> = {
  snowyFir: "pineCone",
  birch: "pit",
  mimosa: "pit",
  cherry: "pit",
  oak: "acorn",
  olive: "pit",
  palm: "coconut",
  cactus: "pit",
  apple: "pit",
  maple: "samara",
  larch: "pineCone",
  christmasFir: "pineCone",
};

const SPROUT_KIND_BY_MODEL: Record<PlantModel, SproutKind> = {
  snowyFir: "needle",
  birch: "leafy",
  mimosa: "leafy",
  cherry: "leafy",
  oak: "leafy",
  olive: "leafy",
  palm: "palm",
  cactus: "cactus",
  apple: "leafy",
  maple: "leafy",
  larch: "needle",
  christmasFir: "needle",
};

// Tronc fin pour le petit arbre, qui s'épaissit avec la maturité.
const getTrunkScale = (maturity: number) => lerp(0.55, 1, maturity);

const getAngleDirection = (angle: number, length: number, y: number) =>
  [Math.cos(angle) * length, y, Math.sin(angle) * length] as Vector3Tuple;

const addSoilMound = (builder: GeometryBuilder) => {
  builder.add(new DodecahedronGeometry(0.12, 0), SOIL_COLOR_LIST, {
    scale: [1, 0.3, 1],
  });
};

const buildSeed = (builder: GeometryBuilder, species: PlantSpecies) => {
  addSoilMound(builder);

  switch (SEED_KIND_BY_MODEL[species.model]) {
    case "acorn":
      builder.add(new IcosahedronGeometry(0.06, 1), [0xc8964a, 0xb98840], {
        position: [0, 0.07, 0],
        rotation: [0, 0, 0.5],
        scale: [0.85, 1.15, 0.85],
      });
      builder.add(new DodecahedronGeometry(0.055, 0), [0x6b4a2c, 0x5e4026], {
        position: [-0.03, 0.12, 0],
        rotation: [0, 0, 0.5],
        scale: [1, 0.6, 1],
      });
      break;
    case "coconut":
      builder.add(new IcosahedronGeometry(0.09, 1), COCONUT_COLOR_LIST, {
        position: [0, 0.06, 0],
        scale: [1, 0.9, 1.1],
        jitter: 0.008,
      });
      break;
    case "pineCone":
      builder.add(new ConeGeometry(0.05, 0.16, 6, 3), PINE_CONE_COLOR_LIST, {
        position: [0, 0.06, 0],
        rotation: [0, 0, Math.PI / 2 - 0.3],
        jitter: 0.008,
      });
      break;
    case "samara":
      builder.addDot(0x9c7a4a, [0, 0.05, 0], 0.03);

      for (const side of [-1, 1]) {
        builder.add(new ConeGeometry(0.045, 0.16, 3), [0xc9a66b, 0xd4b27a], {
          position: [side * 0.075, 0.08, 0],
          rotation: [0, 0, -side * 1.2],
          scale: [1, 1, 0.2],
        });
      }
      break;
    case "pit":
      builder.add(new DodecahedronGeometry(0.07, 0), SEED_COLOR_LIST, {
        position: [0, 0.06, 0],
        rotation: [0.3, 0, 0.4],
        scale: [0.8, 0.65, 1.2],
      });
      break;
  }
};

const buildSprout = (builder: GeometryBuilder, species: PlantSpecies) => {
  const { random } = builder;
  const sproutKind = SPROUT_KIND_BY_MODEL[species.model];

  addSoilMound(builder);

  if (sproutKind === "cactus") {
    builder.add(new IcosahedronGeometry(0.1, 1), species.foliageColorList, {
      position: [0, 0.1, 0],
      scale: [1, 1.2, 1],
      jitter: 0.006,
    });
    builder.addDot(species.accentColor, [0, 0.225, 0], 0.025);
    return;
  }

  if (sproutKind === "palm") {
    builder.add(new IcosahedronGeometry(0.08, 1), COCONUT_COLOR_LIST, {
      position: [0.06, 0.05, 0],
      jitter: 0.006,
    });

    for (let blade = 0; blade < 3; blade++) {
      const angle = (blade / 3) * Math.PI * 2 + random() * 0.4;
      builder.addLeaf(
        [0, 0.03, 0],
        getAngleDirection(angle, 0.35, 1),
        0.32,
        0.035,
        species.foliageColorList,
      );
    }
    return;
  }

  const stemHeight = sproutKind === "needle" ? 0.22 : 0.3;
  builder.addLimb([0, 0, 0], [0, stemHeight, 0], 0.022, 0.016, STEM_COLOR_LIST);

  if (sproutKind === "needle") {
    for (let needle = 0; needle < 6; needle++) {
      builder.addLeaf(
        [0, stemHeight, 0],
        getAngleDirection((needle / 6) * Math.PI * 2, 0.8, 0.6),
        0.11,
        0.018,
        species.foliageColorList,
      );
    }

    builder.add(new ConeGeometry(0.03, 0.08, 5), species.foliageColorList, {
      position: [0, stemHeight + 0.04, 0],
    });
    return;
  }

  for (const side of [-1, 1]) {
    builder.add(new IcosahedronGeometry(0.09, 0), SPROUT_COLOR_LIST, {
      position: [side * 0.08, stemHeight, 0],
      rotation: [0, 0, side * -0.6],
      scale: [1.5, 0.4, 0.8],
    });
  }

  builder.add(new IcosahedronGeometry(0.05, 0), SPROUT_COLOR_LIST, {
    position: [0, stemHeight + 0.04, 0.02],
    scale: [0.8, 0.4, 1.4],
  });
};

// Sapin enneigé et sapin illuminé : étages de cônes.
const buildFir: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const isSnowy = species.model === "snowyFir";
  const isChristmas = species.model === "christmasFir";
  const layerCount = 2 + Math.round(maturity * 3) + (random() < 0.3 ? 1 : 0);
  // Le petit sapin est plus étroit et laisse voir son tronc.
  const widthScale = (0.88 + random() * 0.24) * lerp(0.65, 1, maturity);
  const firstLayerY = lerp(0.42, 0.28, maturity);
  const trunkScale = getTrunkScale(maturity);
  const ornamentPositionList: Vector3Tuple[] = [];
  let topY = 0;

  builder.addLimb(
    [0, 0, 0],
    [0, firstLayerY + 0.12, 0],
    0.09 * trunkScale,
    0.06 * trunkScale,
    [species.trunkColor],
  );

  for (let layer = 0; layer < layerCount; layer++) {
    const progress = layer / (layerCount - 1);
    const radius = (0.55 - 0.32 * progress) * widthScale;
    const height = 0.62 - 0.2 * progress;
    const bottomY = firstLayerY + layer * 0.3;

    builder.add(new ConeGeometry(radius, height, 8, 2), species.foliageColorList, {
      position: [0, bottomY + height / 2, 0],
      rotation: [0, random() * Math.PI, 0],
      jitter: 0.02,
      getFaceColor: isSnowy
        ? (faceCenterY) => (faceCenterY > 0 ? species.accentColor : null)
        : undefined,
    });

    for (let ornament = 0; ornament < 3; ornament++) {
      const angle = (ornament / 3) * Math.PI * 2 + random() * 1.5;
      const heightFraction = 0.15 + random() * 0.25;

      ornamentPositionList.push([
        Math.cos(angle) * radius * (1 - heightFraction),
        bottomY + height * heightFraction,
        Math.sin(angle) * radius * (1 - heightFraction),
      ]);
    }

    topY = bottomY + height;
  }

  const ornamentCount = isChristmas
    ? Math.round(maturity * 8) + accentLevel * 4
    : accentLevel * 3;

  ornamentPositionList
    .sort(() => random() - 0.5)
    .slice(0, ornamentCount)
    .forEach((position, index) =>
      builder.addDot(
        isChristmas && index % 2 === 1
          ? CHRISTMAS_ORNAMENT_GOLD
          : species.accentColor,
        position,
        0.045,
      ),
    );

  if (isChristmas && maturity >= 0.35) {
    builder.add(new OctahedronGeometry(0.08, 0), [STAR_COLOR], {
      position: [0, topY + 0.03, 0],
      scale: [1, 1.2, 0.5],
    });
  }
};

// Mélèze : silhouette élancée faite de fins étages horizontaux.
const buildLarch: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const tierCount = 5 + Math.round(maturity * 3);
  const tierPositionList: Vector3Tuple[] = [];

  builder.addLimb(
    [0, 0, 0],
    [0, 1.05, 0],
    0.06 * getTrunkScale(maturity),
    0.02,
    [species.trunkColor],
  );

  for (let tier = 0; tier < tierCount; tier++) {
    const progress = tier / (tierCount - 1);
    const y = 0.28 + progress * 0.78;
    const radius =
      lerp(0.3, 0.07, progress) *
      lerp(0.75, 1, maturity) *
      (0.9 + random() * 0.2);

    // Étages fins et espacés : le tronc reste visible, silhouette aérée.
    builder.add(new ConeGeometry(radius, 0.09, 7, 1), species.foliageColorList, {
      position: [0, y, 0],
      rotation: [0, random() * Math.PI, 0],
      jitter: 0.015,
    });

    const angle = random() * Math.PI * 2;
    tierPositionList.push([
      Math.cos(angle) * radius * 0.8,
      y - 0.07,
      Math.sin(angle) * radius * 0.8,
    ]);
  }

  builder.add(new ConeGeometry(0.07, 0.16, 6), species.foliageColorList, {
    position: [0, 1.1, 0],
  });

  tierPositionList
    .slice(0, accentLevel * 4)
    .forEach((position) => builder.addDot(species.accentColor, position, 0.035));
};

// Bouleau : tronc blanc tacheté, parfois double, feuillage léger en hauteur.
const buildBirch: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const trunkScale = getTrunkScale(maturity);
  const crownList: Crown[] = [];
  const leanX = (random() - 0.5) * 0.15;
  const leanZ = (random() - 0.5) * 0.15;
  const stemList = [{ leanX, leanZ, height: 1, radius: 0.065 }];

  if (maturity >= 0.35 && random() < 0.45) {
    stemList.push({
      leanX: -leanX - 0.14,
      leanZ: -leanZ + 0.05,
      height: 0.78,
      radius: 0.05,
    });
  }

  for (const stem of stemList) {
    builder.addLimb(
      [0, 0, 0],
      [stem.leanX, stem.height, stem.leanZ],
      stem.radius * trunkScale,
      0.025,
      BIRCH_BARK_COLOR_LIST,
      6,
    );

    const blobCount = 2 + Math.round(maturity * 3);

    for (let blob = 0; blob < blobCount; blob++) {
      const progress = blob / (blobCount - 1);
      const along = 0.55 + progress * 0.45;
      const angle = random() * Math.PI * 2;
      const offset = 0.1 + random() * 0.06;

      crownList.push(
        builder.addBlob(
          [
            stem.leanX * along + Math.cos(angle) * offset,
            stem.height * along + 0.05,
            stem.leanZ * along + Math.sin(angle) * offset,
          ],
          lerp(0.24, 0.16, progress) * lerp(0.75, 1, maturity),
          species.foliageColorList,
          { scale: [0.9, 1.45, 0.9], jitter: 0.02 },
        ),
      );
    }
  }

  builder.addDotsOnCrowns(crownList, accentLevel * 4, [species.accentColor], 0.04);
};

// Mimosa : branches courtes et feuillage couvert de pompons jaunes.
const buildMimosa: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const trunkScale = getTrunkScale(maturity);
  const trunkTop: Vector3Tuple = [0, 0.38, 0];
  const branchCount = maturity >= 0.35 ? 3 : 2;
  const firstAngle = random() * Math.PI * 2;
  const crownList: Crown[] = [];

  builder.addLimb([0, 0, 0], trunkTop, 0.09 * trunkScale, 0.06 * trunkScale, [
    species.trunkColor,
  ]);

  for (let branch = 0; branch < branchCount; branch++) {
    const angle = firstAngle + (branch / branchCount) * Math.PI * 2;
    const tip: Vector3Tuple = [
      Math.cos(angle) * 0.24,
      0.62 + random() * 0.08,
      Math.sin(angle) * 0.24,
    ];

    builder.addLimb(trunkTop, tip, 0.05 * trunkScale, 0.03 * trunkScale, [
      species.trunkColor,
    ]);
    crownList.push(
      builder.addBlob(
        [tip[0], tip[1] + 0.08, tip[2]],
        lerp(0.18, 0.26, maturity),
        species.foliageColorList,
        { scale: [1.1, 0.85, 1.1], jitter: 0.03 },
      ),
    );
  }

  if (maturity >= 0.6) {
    crownList.push(
      builder.addBlob([0, 0.88, 0], 0.24, species.foliageColorList, {
        jitter: 0.03,
      }),
    );
  }

  builder.addDotsOnCrowns(
    crownList,
    6 + Math.round(maturity * 14) + accentLevel * 6,
    [species.accentColor, 0xffe066],
    0.075,
  );
};

// Cerisier : branches étalées et couronne rose aplatie en ombrelle.
const buildCherry: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const trunkScale = getTrunkScale(maturity);
  const trunkTop: Vector3Tuple = [
    (random() - 0.5) * 0.08,
    0.42,
    (random() - 0.5) * 0.08,
  ];
  const branchCount =
    2 + (maturity >= 0.35 ? 1 : 0) + (maturity >= 0.8 ? 1 : 0);
  const spread = lerp(0.2, 0.34, maturity);
  const firstAngle = random() * Math.PI * 2;
  const crownRadius = lerp(0.18, 0.26, maturity);
  const crownList: Crown[] = [
    builder.addBlob([0, 0.8, 0], crownRadius, species.foliageColorList, {
      scale: [1.25, 0.7, 1.25],
    }),
  ];

  builder.addLimb([0, 0, 0], trunkTop, 0.1 * trunkScale, 0.07 * trunkScale, [
    species.trunkColor,
  ]);

  for (let branch = 0; branch < branchCount; branch++) {
    const angle = firstAngle + (branch / branchCount) * Math.PI * 2;
    const tip: Vector3Tuple = [
      Math.cos(angle) * spread,
      0.68 + random() * 0.06,
      Math.sin(angle) * spread,
    ];

    builder.addLimb(trunkTop, tip, 0.05 * trunkScale, 0.025, [
      species.trunkColor,
    ]);
    crownList.push(
      builder.addBlob(
        [tip[0], tip[1] + 0.05, tip[2]],
        crownRadius * (0.85 + random() * 0.2),
        species.foliageColorList,
        { scale: [1.25, 0.7, 1.25] },
      ),
    );
  }

  builder.addDotsOnCrowns(
    crownList,
    Math.round(maturity * 4) + accentLevel * 6,
    [species.accentColor, 0xffd6e4],
    0.04,
  );
};

// Chêne : tronc massif, grosses branches et couronne large et dense.
const buildOak: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const trunkScale = getTrunkScale(maturity);
  const trunkTop: Vector3Tuple = [0, 0.36, 0];
  const branchCount = 3 + (maturity >= 0.6 ? 1 : 0);
  const spread = lerp(0.22, 0.4, maturity);
  const firstAngle = random() * Math.PI * 2;
  const crownList: Crown[] = [
    builder.addBlob(
      [0, 0.82, 0],
      lerp(0.28, 0.36, maturity),
      species.foliageColorList,
      { detail: 1, scale: [1.15, 0.85, 1.15], jitter: 0.05 },
    ),
  ];

  builder.addLimb([0, 0, 0], trunkTop, 0.15 * trunkScale, 0.11 * trunkScale, [
    species.trunkColor,
  ]);

  for (let branch = 0; branch < branchCount; branch++) {
    const angle =
      firstAngle +
      (branch / branchCount) * Math.PI * 2 +
      (random() - 0.5) * 0.5;
    const tip: Vector3Tuple = [
      Math.cos(angle) * spread,
      0.62 + random() * 0.08,
      Math.sin(angle) * spread,
    ];

    builder.addLimb(trunkTop, tip, 0.07 * trunkScale, 0.035 * trunkScale, [
      species.trunkColor,
    ]);
    crownList.push(
      builder.addBlob(
        [tip[0], tip[1] + 0.1, tip[2]],
        lerp(0.2, 0.28, maturity) * (0.85 + random() * 0.3),
        species.foliageColorList,
        { detail: maturity >= 0.8 ? 1 : 0, jitter: 0.04 },
      ),
    );
  }

  builder.addDotsOnCrowns(crownList, accentLevel * 5, [species.accentColor], 0.045);
};

// Olivier : tronc tortueux et feuillage argenté clairsemé, en plateaux.
const buildOlive: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const trunkScale = getTrunkScale(maturity);
  const twist = 0.07 + random() * 0.04;
  const trunkPointList: Vector3Tuple[] = [
    [0, 0, 0],
    [twist, 0.18, 0.03],
    [-twist * 0.6, 0.36, -0.04],
    [twist * 0.5, 0.52, 0.03],
  ];
  const trunkColorList = [species.trunkColor, 0x7a6c56];
  const crownList: Crown[] = [];

  for (let index = 0; index < trunkPointList.length - 1; index++) {
    const radius = lerp(0.12, 0.07, index / 2) * trunkScale;

    builder.addLimb(
      trunkPointList[index],
      trunkPointList[index + 1],
      radius,
      radius * 0.85,
      trunkColorList,
    );

    if (index > 0) {
      builder.addBlob(trunkPointList[index], radius * 1.05, trunkColorList, {
        jitter: 0.01,
      });
    }
  }

  const trunkTop = trunkPointList[trunkPointList.length - 1];
  const limbAngle = random() * Math.PI * 2;

  for (const side of [0, Math.PI]) {
    builder.addLimb(
      trunkTop,
      [
        trunkTop[0] + Math.cos(limbAngle + side) * 0.2,
        0.72,
        trunkTop[2] + Math.sin(limbAngle + side) * 0.2,
      ],
      0.06 * trunkScale,
      0.03,
      trunkColorList,
    );
  }

  const blobCount = 3 + Math.round(maturity * 4);

  for (let blob = 0; blob < blobCount; blob++) {
    const angle = (blob / blobCount) * Math.PI * 2 + random() * 0.8;
    const distance = blob === 0 ? 0 : 0.18 + random() * 0.2;

    crownList.push(
      builder.addBlob(
        [
          Math.cos(angle) * distance,
          0.78 + random() * 0.18,
          Math.sin(angle) * distance,
        ],
        0.15 + random() * 0.07,
        species.foliageColorList,
        { scale: [1.3, 0.6, 1.3], jitter: 0.02 },
      ),
    );
  }

  builder.addDotsOnCrowns(crownList, accentLevel * 6, [species.accentColor], 0.035);
};

// Palmier : tronc courbe en segments et palmes arquées.
const buildPalm: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const segmentCount = 4 + Math.round(maturity * 6);
  const segmentHeight = 0.12;
  const bend = 0.04 + random() * 0.03;
  const trunkScale = getTrunkScale(maturity);
  const trunkColorList = [species.trunkColor, 0x86643f];
  let x = 0;
  let y = 0;
  let tilt = 0;

  for (let segment = 0; segment < segmentCount; segment++) {
    const radius = (0.065 - segment * 0.002) * trunkScale;
    const nextTilt = tilt + bend;
    const nextX = x + Math.sin(nextTilt) * segmentHeight;
    const nextY = y + Math.cos(nextTilt) * segmentHeight;

    builder.addLimb(
      [x, y, 0],
      [nextX, nextY + 0.008, 0],
      radius,
      radius * 0.85,
      trunkColorList,
    );
    x = nextX;
    y = nextY;
    tilt = nextTilt;
  }

  const crown: Vector3Tuple = [x, y, 0];
  const leafCount = 5 + Math.round(maturity * 3);
  const leafLength = lerp(0.42, 0.62, maturity);

  for (let leaf = 0; leaf < leafCount; leaf++) {
    const angle = (leaf / leafCount) * Math.PI * 2 + random() * 0.3;
    const innerTip = builder.addLeaf(
      crown,
      getAngleDirection(angle, 0.8, 0.45),
      leafLength * 0.5,
      0.07,
      species.foliageColorList,
    );

    builder.addLeaf(
      innerTip,
      getAngleDirection(angle, 0.8, -0.55 - random() * 0.2),
      leafLength * 0.55,
      0.06,
      species.foliageColorList,
    );
  }

  const coconutCount =
    accentLevel > 0 ? 2 + accentLevel * 2 : maturity >= 0.6 ? 2 : 0;

  for (let coconut = 0; coconut < coconutCount; coconut++) {
    const angle = (coconut / coconutCount) * Math.PI * 2;

    builder.addDot(
      species.accentColor,
      [x + Math.cos(angle) * 0.07, y - 0.06, Math.sin(angle) * 0.07],
      0.05,
    );
  }
};

// Cactus candélabre : colonne et bras qui apparaissent avec la maturité.
const buildSaguaro: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  // Le jeune cactus est trapu, il s'élance en mûrissant.
  const height = lerp(0.55, 0.9, maturity);
  const radius = lerp(0.12, 0.14, maturity);
  const armRadius = radius * 0.55;
  const armCount = Math.round(maturity * 3);
  const capPositionList: Vector3Tuple[] = [[0, height + 0.05, 0]];
  const firstArmAngle = random() * Math.PI * 2;

  builder.addLimb([0, 0, 0], [0, height, 0], radius * 1.1, radius, species.foliageColorList);
  builder.add(new IcosahedronGeometry(radius, 0), species.foliageColorList, {
    position: [0, height, 0],
    scale: [1, 0.7, 1],
  });

  for (let arm = 0; arm < armCount; arm++) {
    const angle = firstArmAngle + (arm / armCount) * Math.PI * 2;
    const armBottomY = height * (0.33 + random() * 0.28);
    const elbow: Vector3Tuple = [
      Math.cos(angle) * (radius + 0.16),
      armBottomY,
      Math.sin(angle) * (radius + 0.16),
    ];
    const armTop: Vector3Tuple = [elbow[0], armBottomY + 0.28, elbow[2]];

    builder.addLimb([0, armBottomY, 0], elbow, armRadius, armRadius, species.foliageColorList);
    builder.addBlob(elbow, armRadius, species.foliageColorList, { jitter: 0 });
    builder.addLimb(elbow, armTop, armRadius, armRadius, species.foliageColorList);
    builder.add(new IcosahedronGeometry(armRadius, 0), species.foliageColorList, {
      position: armTop,
      scale: [1, 0.7, 1],
    });
    capPositionList.push([armTop[0], armTop[1] + 0.04, armTop[2]]);
  }

  for (let flower = 0; flower < accentLevel * 3; flower++) {
    const capPosition = capPositionList[flower % capPositionList.length];
    const angle = random() * Math.PI * 2;

    builder.addDot(
      species.accentColor,
      [
        capPosition[0] + Math.cos(angle) * 0.04,
        capPosition[1],
        capPosition[2] + Math.sin(angle) * 0.04,
      ],
      0.045,
    );
  }
};

// Figuier de Barbarie : raquettes aplaties qui se ramifient.
const buildOpuntia: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const padCount = 3 + Math.round(maturity * 7);
  const padHalfHeight = 0.195;
  const padList: { center: Vector3; tilt: number; yaw: number; size: number }[] =
    [];

  const getPadUp = (tilt: number, yaw: number) =>
    new Vector3(
      -Math.sin(tilt) * Math.cos(yaw),
      Math.cos(tilt),
      Math.sin(tilt) * Math.sin(yaw),
    );

  for (let pad = 0; pad < padCount; pad++) {
    let center = new Vector3(0, padHalfHeight * 0.85, 0);
    let tilt = 0;
    let yaw = random() * Math.PI;
    let size = 1;

    if (pad > 0) {
      const parent = padList[Math.floor((pad - 1) / 2)];
      const parentTop = parent.center
        .clone()
        .addScaledVector(
          getPadUp(parent.tilt, parent.yaw),
          padHalfHeight * parent.size * 0.9,
        );
      // Raquettes sœurs de part et d'autre : la plante reste équilibrée.
      const side = pad % 2 === 1 ? -1 : 1;

      tilt = parent.tilt * 0.5 + side * (0.35 + random() * 0.25);
      yaw = parent.yaw + (random() - 0.5) * 0.8;
      size = parent.size * (0.85 + random() * 0.1);
      center = parentTop.addScaledVector(
        getPadUp(tilt, yaw),
        padHalfHeight * size * 0.8,
      );
    }

    builder.add(new IcosahedronGeometry(0.15, 1), species.foliageColorList, {
      position: center.toArray() as Vector3Tuple,
      rotation: [0, yaw, tilt],
      scale: [size, 1.3 * size, 0.42 * size],
      jitter: 0.01,
    });
    padList.push({ center, tilt, yaw, size });
  }

  const flowerCount = accentLevel * 2 + (maturity >= 0.6 ? 1 : 0);

  padList.slice(padList.length - flowerCount).forEach((pad, index) => {
    builder.addDot(
      index % 2 === 0 ? species.accentColor : 0xffd84d,
      pad.center
        .clone()
        .addScaledVector(getPadUp(pad.tilt, pad.yaw), padHalfHeight * pad.size)
        .toArray() as Vector3Tuple,
      0.045,
    );
  });
};

// Deux cactus différents : chaque mois d'août tire le sien.
const buildCactus: TreeModelBuilder = (builder, species, treeGrowth) => {
  if (builder.random() < 0.6) {
    buildSaguaro(builder, species, treeGrowth);
  } else {
    buildOpuntia(builder, species, treeGrowth);
  }
};

// Pommier : tronc court et couronne bien ronde, pommes dès qu'il mûrit.
const buildApple: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const trunkScale = getTrunkScale(maturity);
  const trunkTop: Vector3Tuple = [
    (random() - 0.5) * 0.06,
    0.38,
    (random() - 0.5) * 0.06,
  ];
  const firstAngle = random() * Math.PI * 2;
  const spread = lerp(0.15, 0.28, maturity);
  const crownList: Crown[] = [
    builder.addBlob(
      [0, 0.75, 0],
      lerp(0.3, 0.42, maturity),
      species.foliageColorList,
      { detail: 1, jitter: 0.04 },
    ),
  ];

  builder.addLimb([0, 0, 0], trunkTop, 0.1 * trunkScale, 0.07 * trunkScale, [
    species.trunkColor,
  ]);

  for (let branch = 0; branch < 2; branch++) {
    const angle = firstAngle + branch * Math.PI;
    builder.addLimb(
      trunkTop,
      [Math.cos(angle) * spread, 0.58, Math.sin(angle) * spread],
      0.05 * trunkScale,
      0.025,
      [species.trunkColor],
    );
  }

  const sideBlobCount = Math.round(maturity * 3);

  for (let blob = 0; blob < sideBlobCount; blob++) {
    const angle = firstAngle + (blob / sideBlobCount) * Math.PI * 2 + 0.6;

    crownList.push(
      builder.addBlob(
        [Math.cos(angle) * 0.3, 0.68 + random() * 0.1, Math.sin(angle) * 0.3],
        0.22,
        species.foliageColorList,
        { jitter: 0.03 },
      ),
    );
  }

  builder.addDotsOnCrowns(
    crownList,
    Math.round(maturity * 4) + accentLevel * 5,
    [species.accentColor],
    0.05,
  );
};

// Érable : tronc droit et dôme haut aux tons d'automne mêlés.
const buildMaple: TreeModelBuilder = (builder, species, treeGrowth) => {
  const { random } = builder;
  const { maturity, accentLevel } = treeGrowth;
  const trunkScale = getTrunkScale(maturity);
  const toneCount = species.foliageColorList.length;
  const getToneList = (tone: number) => [
    species.foliageColorList[tone % toneCount],
    species.foliageColorList[tone % toneCount],
    species.foliageColorList[(tone + 1) % toneCount],
  ];
  const crownList: Crown[] = [
    builder.addBlob([0, 0.88, 0], lerp(0.3, 0.38, maturity), getToneList(0), {
      detail: 1,
      scale: [1, 1.2, 1],
      jitter: 0.05,
    }),
  ];
  const ringBlobCount = Math.round(maturity * 4);
  const firstAngle = random() * Math.PI * 2;

  builder.addLimb([0, 0, 0], [0, 0.5, 0], 0.09 * trunkScale, 0.06 * trunkScale, [
    species.trunkColor,
  ]);

  for (let blob = 0; blob < ringBlobCount; blob++) {
    const angle = firstAngle + (blob / ringBlobCount) * Math.PI * 2;

    crownList.push(
      builder.addBlob(
        [Math.cos(angle) * 0.28, 0.75 + random() * 0.25, Math.sin(angle) * 0.28],
        0.2 + random() * 0.06,
        getToneList(blob + 1),
        { jitter: 0.03 },
      ),
    );
  }

  builder.addDotsOnCrowns(crownList, accentLevel * 5, [species.accentColor], 0.04);
};

const TREE_MODEL_BUILDER_BY_MODEL: Record<PlantModel, TreeModelBuilder> = {
  snowyFir: buildFir,
  birch: buildBirch,
  mimosa: buildMimosa,
  cherry: buildCherry,
  oak: buildOak,
  olive: buildOlive,
  palm: buildPalm,
  cactus: buildCactus,
  apple: buildApple,
  maple: buildMaple,
  larch: buildLarch,
  christmasFir: buildFir,
};

// Géométrie d'une plante, posée sur y = 0 et normalisée à une hauteur de 1 :
// le palier donne la forme (graine, pousse, petit arbre puis arbre de plus en
// plus fourni), la croissance donne l'échelle. Le tirage aléatoire dépend du
// mois : deux arbres de la même espèce ne se ressemblent jamais tout à fait.
export const buildPlantGeometry = (
  species: PlantSpecies,
  stageIndex: number,
  seedKey: string,
): BufferGeometry => {
  const builder = new GeometryBuilder(createRandom(seedKey));

  if (stageIndex === 0) {
    buildSeed(builder, species);
  } else if (stageIndex === 1) {
    buildSprout(builder, species);
  } else {
    TREE_MODEL_BUILDER_BY_MODEL[species.model](builder, species, {
      maturity: MATURITY_BY_STAGE[stageIndex],
      accentLevel: ACCENT_LEVEL_BY_STAGE[stageIndex],
    });
  }

  const geometry = builder.build();
  geometry.computeBoundingBox();
  const height = geometry.boundingBox?.max.y ?? 1;
  geometry.scale(1 / height, 1 / height, 1 / height);

  return geometry;
};
