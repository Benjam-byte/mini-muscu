import { isPlannedWorkoutDay, type RestDayScheduleEntry } from "./restDay";
import { formatWorkoutDateKey } from "./workoutHistory";

export const FOREST_LAST_SEEN_MONTH_KEY = "forest_last_seen_month";

const WORKOUT_DONE_KEY_PREFIX = "workout_done_";
const MAX_SIMULATED_SESSION_COUNT = 100;

export type PlantModel =
  | "snowyFir"
  | "birch"
  | "mimosa"
  | "cherry"
  | "oak"
  | "olive"
  | "palm"
  | "cactus"
  | "apple"
  | "maple"
  | "larch"
  | "christmasFir";

export type PlantSpecies = {
  name: string;
  monthLabel: string;
  emoji: string;
  model: PlantModel;
  trunkColor: number;
  foliageColorList: number[];
  accentColor: number;
};

export type GrowthStage = {
  minGrowthRatio: number;
  emoji: string;
  title: string;
  description: string;
};

export type StreakRunSummary = {
  length: number;
  startDateKey: string;
  endDateKey: string;
  jokerDateKeyList: string[];
};

export type HistoryAnalysis = {
  streak: number;
  streakRunList: StreakRunSummary[];
  firstDateKey: string | null;
  todayDateKey: string;
  isTodayCompleted: boolean;
  growthPointsByMonthKey: Map<string, number>;
  completedCountByMonthKey: Map<string, number>;
};

export type MonthGrowth = {
  monthKey: string;
  monthDate: Date;
  species: PlantSpecies;
  plantName: string;
  completedCount: number;
  plannedCount: number;
  remainingPlannedCount: number;
  growthPoints: number;
  growthRatio: number;
  stageIndex: number;
};

export type ForestScenePlant = {
  monthKey: string;
  species: PlantSpecies;
  stageIndex: number;
  height: number;
};

export type ForestSceneData = {
  plantedList: ForestScenePlant[];
  currentPlant: ForestScenePlant;
  growthMultiplier: number;
};

// Une espèce par mois de l'année, construite sur 5 silhouettes low-poly.
export const PLANT_SPECIES_BY_MONTH: PlantSpecies[] = [
  {
    name: "Sapin enneigé",
    monthLabel: "de janvier",
    emoji: "🌲",
    model: "snowyFir",
    trunkColor: 0x6b4a2f,
    foliageColorList: [0x2f6b4f, 0x377a59, 0x2a5f47],
    accentColor: 0xf3f7fb,
  },
  {
    name: "Bouleau",
    monthLabel: "de février",
    emoji: "🌳",
    model: "birch",
    trunkColor: 0xece7dc,
    foliageColorList: [0x9cc96b, 0xaed27a, 0x8fbf60],
    accentColor: 0xd8e36a,
  },
  {
    name: "Mimosa",
    monthLabel: "de mars",
    emoji: "🌼",
    model: "mimosa",
    trunkColor: 0x7a5a3a,
    foliageColorList: [0x7fa35a, 0x8db066, 0x749a52],
    accentColor: 0xf7d433,
  },
  {
    name: "Cerisier",
    monthLabel: "d'avril",
    emoji: "🌸",
    model: "cherry",
    trunkColor: 0x6e4a3a,
    foliageColorList: [0xf4b6c8, 0xeea0b8, 0xf8c8d6],
    accentColor: 0xffffff,
  },
  {
    name: "Chêne",
    monthLabel: "de mai",
    emoji: "🌳",
    model: "oak",
    trunkColor: 0x6a4a2c,
    foliageColorList: [0x4f8a3c, 0x5c9a45, 0x467d35],
    accentColor: 0xb3803a,
  },
  {
    name: "Olivier",
    monthLabel: "de juin",
    emoji: "🫒",
    model: "olive",
    trunkColor: 0x8a7a62,
    foliageColorList: [0x8ea37a, 0x9db189, 0x83996f],
    accentColor: 0x4b5a2a,
  },
  {
    name: "Palmier",
    monthLabel: "de juillet",
    emoji: "🌴",
    model: "palm",
    trunkColor: 0x9a7650,
    foliageColorList: [0x3f9b4a, 0x4fae58, 0x378a41],
    accentColor: 0x6e4a2a,
  },
  {
    name: "Cactus",
    monthLabel: "d'août",
    emoji: "🌵",
    model: "cactus",
    trunkColor: 0x5f9e5a,
    foliageColorList: [0x5f9e5a, 0x6aab63, 0x56924f],
    accentColor: 0xff6f91,
  },
  {
    name: "Pommier",
    monthLabel: "de septembre",
    emoji: "🍎",
    model: "apple",
    trunkColor: 0x6a4a2c,
    foliageColorList: [0x5c9a3f, 0x6aab4a, 0x528d38],
    accentColor: 0xd8382f,
  },
  {
    name: "Érable",
    monthLabel: "d'octobre",
    emoji: "🍁",
    model: "maple",
    trunkColor: 0x5e3f28,
    foliageColorList: [0xd9532b, 0xe8743a, 0xc43d26],
    accentColor: 0xf2b134,
  },
  {
    name: "Mélèze doré",
    monthLabel: "de novembre",
    emoji: "🌲",
    model: "larch",
    trunkColor: 0x6b4a2f,
    foliageColorList: [0xd8a53a, 0xc98f2c, 0xe2b54d],
    accentColor: 0x8a5a2b,
  },
  {
    name: "Sapin illuminé",
    monthLabel: "de décembre",
    emoji: "🎄",
    model: "christmasFir",
    trunkColor: 0x6b4a2f,
    foliageColorList: [0x2b6e45, 0x347d50, 0x26613d],
    accentColor: 0xe23b3b,
  },
];

// La plante reste une graine pendant les premières séances du mois et germe
// à la suivante.
export const SEED_SESSION_COUNT = 3;

// Après la graine, le palier dépend des points de croissance rapportés au
// nombre de séances prévues dans le mois : 100 % = une séance par jour prévu,
// sans bonus.
export const GROWTH_STAGE_LIST: GrowthStage[] = [
  {
    minGrowthRatio: 0,
    emoji: "🌰",
    title: "Graine",
    description: `Elle germe après ${SEED_SESSION_COUNT} séances.`,
  },
  {
    minGrowthRatio: 0,
    emoji: "🌱",
    title: "Pousse",
    description: "Elle sort de terre.",
  },
  {
    minGrowthRatio: 0.25,
    emoji: "🪴",
    title: "Petit arbre",
    description: "La routine prend racine.",
  },
  {
    minGrowthRatio: 0.5,
    emoji: "🌿",
    title: "Jeune arbre",
    description: "Belle régularité.",
  },
  {
    minGrowthRatio: 0.9,
    emoji: "🌳",
    title: "Arbre",
    description: "Tu construis une vraie habitude.",
  },
  {
    minGrowthRatio: 1.3,
    emoji: "🌲",
    title: "Grand arbre",
    description: "Ta discipline grandit.",
  },
  {
    minGrowthRatio: 1.7,
    emoji: "✨",
    title: "Majestueux",
    description: "Un mois exceptionnel.",
  },
];

export const GROWTH_MULTIPLIER_STEP_LIST = [
  { minStreak: 3, multiplier: 1.5 },
  { minStreak: 7, multiplier: 2 },
];

export const getGrowthMultiplier = (streak: number): number => {
  let growthMultiplier = 1;

  for (const multiplierStep of GROWTH_MULTIPLIER_STEP_LIST) {
    if (streak >= multiplierStep.minStreak) {
      growthMultiplier = multiplierStep.multiplier;
    }
  }

  return growthMultiplier;
};

export const getNextGrowthMultiplierStep = (streak: number) =>
  GROWTH_MULTIPLIER_STEP_LIST.find(
    (multiplierStep) => multiplierStep.minStreak > streak,
  ) ?? null;

export const formatGrowthMultiplier = (growthMultiplier: number): string =>
  `×${growthMultiplier.toLocaleString("fr-FR")}`;

export const getGrowthStageIndex = (
  growthPoints: number,
  plannedCount: number,
  completedCount: number,
): number => {
  if (completedCount <= SEED_SESSION_COUNT) {
    return 0;
  }

  const growthRatio = plannedCount > 0 ? growthPoints / plannedCount : 0;
  let stageIndex = 1;

  for (let index = 2; index < GROWTH_STAGE_LIST.length; index++) {
    if (growthRatio + 1e-9 >= GROWTH_STAGE_LIST[index].minGrowthRatio) {
      stageIndex = index;
    }
  }

  // Au plus un palier par séance après la graine : même avec un gros bonus
  // de série, la pousse et le petit arbre restent visibles.
  return Math.min(stageIndex, completedCount - SEED_SESSION_COUNT);
};

// Chaque phase a sa plage de taille, bien distincte des autres (graine, pousse,
// petit arbre), puis l'arbre grandit séance après séance dans sa plage.
const PLANT_HEIGHT_RANGE_BY_STAGE: [number, number][] = [
  [0.22, 0.3],
  [0.32, 0.44],
  [0.52, 0.7],
  [0.8, 0.98],
  [1, 1.25],
  [1.3, 1.5],
  [1.55, 1.8],
];
const MAX_GROWTH_RATIO = 2.2;

// La graine grossit un peu à chaque séance, les autres paliers suivent les
// points de croissance.
export const getStageProgress = (monthGrowth: MonthGrowth): number => {
  const { stageIndex, growthRatio, completedCount } = monthGrowth;

  if (stageIndex === 0) {
    return completedCount / (SEED_SESSION_COUNT + 1);
  }

  const stageMinRatio = GROWTH_STAGE_LIST[stageIndex].minGrowthRatio;
  const nextStageMinRatio =
    GROWTH_STAGE_LIST[stageIndex + 1]?.minGrowthRatio ?? MAX_GROWTH_RATIO;

  return Math.min(
    1,
    Math.max(
      0,
      (growthRatio - stageMinRatio) / (nextStageMinRatio - stageMinRatio),
    ),
  );
};

export const getPlantHeight = (monthGrowth: MonthGrowth): number => {
  const [minHeight, maxHeight] =
    PLANT_HEIGHT_RANGE_BY_STAGE[monthGrowth.stageIndex];

  return minHeight + (maxHeight - minHeight) * getStageProgress(monthGrowth);
};

export const getDateFromWorkoutDoneKey = (dateKey: string): Date | null => {
  const datePart = dateKey.replace(WORKOUT_DONE_KEY_PREFIX, "");
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
};

const getWorkoutDoneKey = (date: Date) =>
  `${WORKOUT_DONE_KEY_PREFIX}${formatWorkoutDateKey(date)}`;

const getMonthKey = (date: Date) => formatWorkoutDateKey(date).slice(0, 7);

const getStartOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Parcourt l'historique une seule fois, du premier jour fait ou protégé
// jusqu'à aujourd'hui. Les jours de repos sont ignorés, un jour protégé
// prolonge la série sans faire pousser la plante, et la séance du jour non
// encore faite ne casse rien.
export const analyzeHistory = ({
  completedWorkoutDateKeySet,
  protectedDateKeySet,
  restDaySchedule,
  workoutDayDate,
}: {
  completedWorkoutDateKeySet: Set<string>;
  protectedDateKeySet: Set<string>;
  restDaySchedule: RestDayScheduleEntry[];
  workoutDayDate: Date;
}): HistoryAnalysis => {
  const today = getStartOfDay(workoutDayDate);
  const todayDateKey = getWorkoutDoneKey(today);
  const isTodayCompleted = completedWorkoutDateKeySet.has(todayDateKey);
  const growthPointsByMonthKey = new Map<string, number>();
  const completedCountByMonthKey = new Map<string, number>();
  const streakRunList: StreakRunSummary[] = [];
  let firstDateKey: string | null = null;

  for (const dateKey of [
    ...completedWorkoutDateKeySet,
    ...protectedDateKeySet,
  ]) {
    if (firstDateKey === null || dateKey < firstDateKey) {
      firstDateKey = dateKey;
    }
  }

  const firstDate = firstDateKey
    ? getDateFromWorkoutDoneKey(firstDateKey)
    : null;
  let streak = 0;
  let currentRunDateKeyList: string[] = [];
  let currentRunJokerDateKeyList: string[] = [];

  const pushCurrentRun = () => {
    if (currentRunDateKeyList.length === 0) {
      return;
    }

    streakRunList.push({
      length: currentRunDateKeyList.length,
      startDateKey: currentRunDateKeyList[0],
      endDateKey: currentRunDateKeyList[currentRunDateKeyList.length - 1],
      jokerDateKeyList: currentRunJokerDateKeyList,
    });

    currentRunDateKeyList = [];
    currentRunJokerDateKeyList = [];
  };

  if (firstDate) {
    for (
      const date = new Date(firstDate);
      date <= today;
      date.setDate(date.getDate() + 1)
    ) {
      const datePart = formatWorkoutDateKey(date);

      if (!isPlannedWorkoutDay(restDaySchedule, date, datePart)) {
        continue;
      }

      const dateKey = `${WORKOUT_DONE_KEY_PREFIX}${datePart}`;
      const isWorkoutDone = completedWorkoutDateKeySet.has(dateKey);
      const isWorkoutProtected = protectedDateKeySet.has(dateKey);

      if (dateKey === todayDateKey && !isWorkoutDone) {
        continue;
      }

      if (!isWorkoutDone && !isWorkoutProtected) {
        pushCurrentRun();
        streak = 0;
        continue;
      }

      streak += 1;
      currentRunDateKeyList.push(dateKey);

      if (isWorkoutProtected) {
        currentRunJokerDateKeyList.push(dateKey);
      }

      if (isWorkoutDone) {
        const monthKey = datePart.slice(0, 7);

        growthPointsByMonthKey.set(
          monthKey,
          (growthPointsByMonthKey.get(monthKey) ?? 0) +
            getGrowthMultiplier(streak),
        );
        completedCountByMonthKey.set(
          monthKey,
          (completedCountByMonthKey.get(monthKey) ?? 0) + 1,
        );
      }
    }
  }

  pushCurrentRun();

  return {
    streak,
    streakRunList: streakRunList
      .sort((firstRun, secondRun) => {
        if (firstRun.length !== secondRun.length) {
          return secondRun.length - firstRun.length;
        }

        return secondRun.endDateKey.localeCompare(firstRun.endDateKey);
      })
      .slice(0, 5),
    firstDateKey,
    todayDateKey,
    isTodayCompleted,
    growthPointsByMonthKey,
    completedCountByMonthKey,
  };
};

// Les séances prévues comptent sur tout le mois, futur compris, pour que
// l'objectif soit visible dès le début. Le mois de la toute première séance
// ne compte qu'à partir de celle-ci : démarrer en cours de mois ne pénalise pas.
export const getMonthGrowth = (
  monthDate: Date,
  historyAnalysis: HistoryAnalysis,
  restDaySchedule: RestDayScheduleEntry[],
): MonthGrowth => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const monthKey = getMonthKey(firstDayOfMonth);
  const firstDate = historyAnalysis.firstDateKey
    ? getDateFromWorkoutDoneKey(historyAnalysis.firstDateKey)
    : null;
  const today = getDateFromWorkoutDoneKey(historyAnalysis.todayDateKey);
  let plannedCount = 0;
  let remainingPlannedCount = 0;

  for (
    const date = new Date(
      firstDate && getMonthKey(firstDate) === monthKey
        ? firstDate
        : firstDayOfMonth,
    );
    date.getMonth() === month;
    date.setDate(date.getDate() + 1)
  ) {
    if (!isPlannedWorkoutDay(restDaySchedule, date, formatWorkoutDateKey(date))) {
      continue;
    }

    plannedCount += 1;

    if (
      today &&
      (date > today ||
        (date.getTime() === today.getTime() &&
          !historyAnalysis.isTodayCompleted))
    ) {
      remainingPlannedCount += 1;
    }
  }

  const species = PLANT_SPECIES_BY_MONTH[month];
  const growthPoints = historyAnalysis.growthPointsByMonthKey.get(monthKey) ?? 0;
  const completedCount =
    historyAnalysis.completedCountByMonthKey.get(monthKey) ?? 0;

  return {
    monthKey,
    monthDate: firstDayOfMonth,
    species,
    plantName: `${species.name} ${species.monthLabel}`,
    completedCount,
    plannedCount,
    remainingPlannedCount,
    growthPoints,
    growthRatio: plannedCount > 0 ? growthPoints / plannedCount : 0,
    stageIndex: getGrowthStageIndex(growthPoints, plannedCount, completedCount),
  };
};

// Simule les prochaines séances en supposant que la série continue.
export const getSessionsToNextStage = (
  monthGrowth: MonthGrowth,
  streak: number,
): number | null => {
  const nextStageIndex = monthGrowth.stageIndex + 1;

  if (
    nextStageIndex >= GROWTH_STAGE_LIST.length ||
    monthGrowth.plannedCount === 0
  ) {
    return null;
  }

  let simulatedStreak = streak;
  let simulatedGrowthPoints = monthGrowth.growthPoints;
  let sessionCount = 0;

  while (
    getGrowthStageIndex(
      simulatedGrowthPoints,
      monthGrowth.plannedCount,
      monthGrowth.completedCount + sessionCount,
    ) < nextStageIndex &&
    sessionCount < MAX_SIMULATED_SESSION_COUNT
  ) {
    simulatedStreak += 1;
    simulatedGrowthPoints += getGrowthMultiplier(simulatedStreak);
    sessionCount += 1;
  }

  return sessionCount;
};

// Les mois terminés, du mois de la première séance au mois précédent. Un mois
// à 1-3 séances plante une graine, un mois sans aucune séance ne plante rien.
export const getForest = (
  historyAnalysis: HistoryAnalysis,
  restDaySchedule: RestDayScheduleEntry[],
): MonthGrowth[] => {
  const firstDate = historyAnalysis.firstDateKey
    ? getDateFromWorkoutDoneKey(historyAnalysis.firstDateKey)
    : null;
  const today = getDateFromWorkoutDoneKey(historyAnalysis.todayDateKey);

  if (!firstDate || !today) {
    return [];
  }

  const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const forest: MonthGrowth[] = [];

  for (
    const monthDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
    monthDate < currentMonthDate;
    monthDate.setMonth(monthDate.getMonth() + 1)
  ) {
    const monthGrowth = getMonthGrowth(
      monthDate,
      historyAnalysis,
      restDaySchedule,
    );

    if (monthGrowth.completedCount > 0) {
      forest.push(monthGrowth);
    }
  }

  return forest;
};

const getForestScenePlant = (monthGrowth: MonthGrowth): ForestScenePlant => ({
  monthKey: monthGrowth.monthKey,
  species: monthGrowth.species,
  stageIndex: monthGrowth.stageIndex,
  height: getPlantHeight(monthGrowth),
});

export const getForestSceneData = (
  forest: MonthGrowth[],
  currentMonthGrowth: MonthGrowth,
  streak: number,
): ForestSceneData => ({
  plantedList: forest.map(getForestScenePlant),
  currentPlant: getForestScenePlant(currentMonthGrowth),
  growthMultiplier: getGrowthMultiplier(streak),
});

export const getLastSeenForestMonthKey = (): string | null =>
  localStorage.getItem(FOREST_LAST_SEEN_MONTH_KEY);

export const saveLastSeenForestMonthKey = (monthKey: string): void => {
  localStorage.setItem(FOREST_LAST_SEEN_MONTH_KEY, monthKey);
};
