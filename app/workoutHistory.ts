export type WorkoutLevel =
  | "base"
  | "entraine"
  | "bien_entraine"
  | "sportif_haut_niveau";

export type DifficultyRating = 1 | 2 | 3 | 4 | 5;

export type WorkoutHistoryItem = {
  dateKey: string;
  isCompleted: true;
  workoutLevel: WorkoutLevel;
  difficultyRating: DifficultyRating;
  session: string;
  completedAt: string;
};

export const CURRENT_WORKOUT_LEVEL_KEY = "current_workout_level";
export const LEVEL_UP_SUGGESTION_DISMISSED_AT_KEY =
  "level_up_suggestion_dismissed_at";

export const WORKOUT_LEVEL_LIST: WorkoutLevel[] = [
  "base",
  "entraine",
  "bien_entraine",
  "sportif_haut_niveau",
];

export const DIFFICULTY_EMOJI_BY_RATING: Record<DifficultyRating, string> = {
  1: "😄",
  2: "🙂",
  3: "😐",
  4: "😤",
  5: "🥵",
};

export const WORKOUT_LEVEL_EMOJI_BY_LEVEL: Record<WorkoutLevel, string> = {
  base: "🌱",
  entraine: "💪",
  bien_entraine: "🔥",
  sportif_haut_niveau: "⚡",
};

export const getCurrentWorkoutLevel = (): WorkoutLevel => {
  const storedWorkoutLevel = localStorage.getItem(CURRENT_WORKOUT_LEVEL_KEY);

  if (
    storedWorkoutLevel === "base" ||
    storedWorkoutLevel === "entraine" ||
    storedWorkoutLevel === "bien_entraine" ||
    storedWorkoutLevel === "sportif_haut_niveau"
  ) {
    return storedWorkoutLevel;
  }

  return "base";
};

export const getWorkoutHistoryItem = (
  dateKey: string,
): WorkoutHistoryItem | null => {
  const storedWorkoutHistoryItem = localStorage.getItem(dateKey);

  if (!storedWorkoutHistoryItem || storedWorkoutHistoryItem === "true") {
    return null;
  }

  try {
    return JSON.parse(storedWorkoutHistoryItem) as WorkoutHistoryItem;
  } catch (error) {
    console.error("Unable to parse workout history item", error);
    return null;
  }
};

export const isWorkoutCompleted = (dateKey: string): boolean => {
  const storedWorkoutHistoryItem = localStorage.getItem(dateKey);

  if (storedWorkoutHistoryItem === "true") {
    return true;
  }

  const workoutHistoryItem = getWorkoutHistoryItem(dateKey);

  return workoutHistoryItem?.isCompleted === true;
};

export const getCompletedWorkoutHistoryItemList =
  (): WorkoutHistoryItem[] => {
    const workoutHistoryItemList: WorkoutHistoryItem[] = [];

    for (let index = 0; index < localStorage.length; index++) {
      const storageKey = localStorage.key(index);

      if (!storageKey || !storageKey.startsWith("workout_done_")) {
        continue;
      }

      const workoutHistoryItem = getWorkoutHistoryItem(storageKey);

      if (workoutHistoryItem?.isCompleted) {
        workoutHistoryItemList.push(workoutHistoryItem);
      }
    }

    return workoutHistoryItemList.sort((firstItem, secondItem) =>
      firstItem.dateKey.localeCompare(secondItem.dateKey),
    );
  };

export const shouldSuggestLevelUp = (
  currentWorkoutLevel: WorkoutLevel,
): boolean => {
  if (currentWorkoutLevel === "sportif_haut_niveau") {
    return false;
  }

  const completedWorkoutHistoryItemList =
    getCompletedWorkoutHistoryItemList();
  const currentLevelWorkoutHistoryItemList =
    completedWorkoutHistoryItemList.filter(
      (workoutHistoryItem) =>
        workoutHistoryItem.workoutLevel === currentWorkoutLevel,
    );
  const lastCurrentLevelWorkoutHistoryItemList =
    currentLevelWorkoutHistoryItemList.slice(-3);

  if (lastCurrentLevelWorkoutHistoryItemList.length < 3) {
    return false;
  }

  return lastCurrentLevelWorkoutHistoryItemList.every(
    (workoutHistoryItem) => workoutHistoryItem.difficultyRating <= 2,
  );
};
