// Outil de test local, jamais inclus dans le build de production.
// /mini-muscu/?demo-foret=48 remplit l'historique de 48 mois de séances
// variées pour voir une forêt bien fournie ; /mini-muscu/?demo-foret=reset
// restaure l'historique sauvegardé avant la démo.
import { FOREST_LAST_SEEN_MONTH_KEY } from "./forest";
import { getSavedRestDaySchedule, isPlannedWorkoutDay } from "./restDay";
import {
  formatWorkoutDateKey,
  type DifficultyRating,
  type WorkoutHistoryItem,
} from "./workoutHistory";

const DEMO_FOREST_PARAM = "demo-foret";
const DEMO_FOREST_BACKUP_KEY = "demo_forest_backup";
const STREAK_PROTECTION_KEY = "streak_protection";
const DEFAULT_MONTH_COUNT = 48;
const MAX_MONTH_COUNT = 120;
const WORKOUT_DAY_START_HOUR = 6;

// Probabilité de faire chaque séance prévue, tirée au hasard pour chaque mois :
// de quoi obtenir tous les paliers, du mois parfait au mois vide, avec
// quelques mois à peine commencés qui restent au stade de graine ou de pousse.
const ATTENDANCE_RATE_LIST = [
  1, 1, 0.95, 0.9, 0.85, 0.75, 0.6, 0.45, 0.3, 0.2, 0.1, 0.05, 0,
];

const getWorkoutDoneKeyList = () => {
  const keyList: string[] = [];

  for (let index = 0; index < localStorage.length; index++) {
    const storageKey = localStorage.key(index);

    if (storageKey?.startsWith("workout_done_")) {
      keyList.push(storageKey);
    }
  }

  return keyList;
};

const saveBackupOnce = () => {
  if (localStorage.getItem(DEMO_FOREST_BACKUP_KEY)) {
    return;
  }

  const backup: Record<string, string | null> = {
    [STREAK_PROTECTION_KEY]: localStorage.getItem(STREAK_PROTECTION_KEY),
    [FOREST_LAST_SEEN_MONTH_KEY]: localStorage.getItem(
      FOREST_LAST_SEEN_MONTH_KEY,
    ),
  };

  for (const storageKey of getWorkoutDoneKeyList()) {
    backup[storageKey] = localStorage.getItem(storageKey);
  }

  localStorage.setItem(DEMO_FOREST_BACKUP_KEY, JSON.stringify(backup));
};

const restoreBackup = () => {
  const savedBackup = localStorage.getItem(DEMO_FOREST_BACKUP_KEY);

  if (!savedBackup) {
    return;
  }

  for (const storageKey of getWorkoutDoneKeyList()) {
    localStorage.removeItem(storageKey);
  }

  const backup = JSON.parse(savedBackup) as Record<string, string | null>;

  for (const [storageKey, value] of Object.entries(backup)) {
    if (value === null) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, value);
    }
  }

  localStorage.removeItem(DEMO_FOREST_BACKUP_KEY);
};

const seedDemoForest = (monthCount: number) => {
  saveBackupOnce();

  for (const storageKey of getWorkoutDoneKeyList()) {
    localStorage.removeItem(storageKey);
  }

  const restDaySchedule = getSavedRestDaySchedule();
  const workoutDay = new Date();

  if (workoutDay.getHours() < WORKOUT_DAY_START_HOUR) {
    workoutDay.setDate(workoutDay.getDate() - 1);
  }

  workoutDay.setHours(0, 0, 0, 0);
  const startDate = new Date(
    workoutDay.getFullYear(),
    workoutDay.getMonth() - monthCount,
    1,
  );
  const currentMonthDate = new Date(
    workoutDay.getFullYear(),
    workoutDay.getMonth(),
    1,
  );
  let attendanceRate = 1;

  // Le mois en cours reste vide : sa plante est une graine, et la séance du
  // jour la fait germer.
  for (
    const date = new Date(startDate);
    date < currentMonthDate;
    date.setDate(date.getDate() + 1)
  ) {
    if (date.getDate() === 1) {
      attendanceRate =
        ATTENDANCE_RATE_LIST[
          Math.floor(Math.random() * ATTENDANCE_RATE_LIST.length)
        ];
    }

    const datePart = formatWorkoutDateKey(date);

    if (
      !isPlannedWorkoutDay(restDaySchedule, date, datePart) ||
      Math.random() >= attendanceRate
    ) {
      continue;
    }

    const dateKey = `workout_done_${datePart}`;
    const workoutHistoryItem: WorkoutHistoryItem = {
      dateKey,
      isCompleted: true,
      workoutLevel: "base",
      difficultyRating: (2 + Math.floor(Math.random() * 3)) as DifficultyRating,
      session: "Séance de démo",
      completedAt: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        18,
      ).toISOString(),
    };

    localStorage.setItem(dateKey, JSON.stringify(workoutHistoryItem));
  }

  // Affiche l'annonce « a rejoint ta forêt » pour le mois précédent.
  const twoMonthsAgo = new Date(
    workoutDay.getFullYear(),
    workoutDay.getMonth() - 2,
    1,
  );
  localStorage.setItem(
    FOREST_LAST_SEEN_MONTH_KEY,
    formatWorkoutDateKey(twoMonthsAgo).slice(0, 7),
  );
};

export const applyDemoForest = (): void => {
  const searchParams = new URLSearchParams(window.location.search);
  const demoValue = searchParams.get(DEMO_FOREST_PARAM);

  if (demoValue === null) {
    return;
  }

  if (demoValue === "reset") {
    restoreBackup();
  } else {
    const monthCount = Number.parseInt(demoValue, 10);
    seedDemoForest(
      Number.isFinite(monthCount) && monthCount > 0
        ? Math.min(monthCount, MAX_MONTH_COUNT)
        : DEFAULT_MONTH_COUNT,
    );
  }

  searchParams.delete(DEMO_FOREST_PARAM);
  const search = searchParams.toString();
  window.location.replace(
    `${window.location.pathname}${search ? `?${search}` : ""}`,
  );
};
