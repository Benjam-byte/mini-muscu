import { useEffect, useState } from "react";
import {
  WORKOUT_PLAN,
  WORKOUT_PLAN_BIEN_ENTRAINE,
  WORKOUT_PLAN_ENTRAINE,
  WORKOUT_PLAN_SPORTIF_HAUT_NIVEAU,
} from "../workout";
import {
  CURRENT_WORKOUT_LEVEL_KEY,
  DIFFICULTY_EMOJI_BY_RATING,
  LEVEL_UP_SUGGESTION_DISMISSED_AT_KEY,
  WORKOUT_LEVEL_EMOJI_BY_LEVEL,
  WORKOUT_LEVEL_LIST,
  getCurrentWorkoutLevel,
  getWorkoutHistoryItem,
  isWorkoutCompleted,
  shouldSuggestLevelUp,
  type DifficultyRating,
  type WorkoutHistoryItem,
  type WorkoutLevel,
} from "../workoutHistory";
import { StreakCard, type StreakRunSummary } from "./streakCard";
import { MonthStatsCard, type MonthStats } from "./monthStratsCard";
import { WorkoutPlanPicker } from "./workoutPlanPicker";
import { ExercisePreviewButton, EyeIcon } from "./eyeIcon";
import { ExerciseIllustrationModal } from "./exerciceModal";

type Screen = "home" | "workout" | "complete" | "history";

const REST_DURATION = 30;
const WORKOUT_DAY_START_HOUR = 6;
const SELECTED_WORKOUT_PLAN_KEY = "selected_workout_plan";
const LEVEL_UP_SUGGESTION_DISMISSAL_DURATION = 7 * 24 * 60 * 60 * 1000;
const STREAK_PROTECTION_KEY = "streak_protection";
const MAX_STREAK_JOKER_COUNT = 4;
const STREAK_JOKER_REGENERATION_DURATION = 7 * 24 * 60 * 60 * 1000;
const MISSED_DAY_RESTORE_TAP_COUNT = 4;
const MISSED_DAY_RESTORE_TAP_DELAY = 900;

const WORKOUT_PLAN_BY_LEVEL: Record<WorkoutLevel, typeof WORKOUT_PLAN> = {
  base: WORKOUT_PLAN,
  entraine: WORKOUT_PLAN_ENTRAINE,
  bien_entraine: WORKOUT_PLAN_BIEN_ENTRAINE,
  sportif_haut_niveau: WORKOUT_PLAN_SPORTIF_HAUT_NIVEAU,
};

const DIFFICULTY_OPTION_LIST: {
  rating: DifficultyRating;
  label: string;
}[] = [
  { rating: 1, label: "Très facile" },
  { rating: 2, label: "Facile" },
  { rating: 3, label: "Bien dosée" },
  { rating: 4, label: "Difficile" },
  { rating: 5, label: "Trop difficile" },
];

type StreakProtectionState = {
  jokerCount: number;
  lastRegeneratedAt: string;
  protectedDateKeyList: string[];
  bestStreak: number;
};

type StreakAnalysis = {
  streak: number;
  protectionState: StreakProtectionState;
  bestStreakRunList: StreakRunSummary[];
};

type MissedDayRestoreTapState = {
  dateKey: string;
  count: number;
  lastTappedAt: number;
};

export default function Welcome() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentCircuit, setCurrentCircuit] = useState(1);
  const [isFinisher, setIsFinisher] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedDifficultyRating, setSelectedDifficultyRating] =
    useState<DifficultyRating | null>(null);
  const [shouldShowLevelUpSuggestion, setShouldShowLevelUpSuggestion] =
    useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [selectedExerciseName, setSelectedExerciseName] = useState<
    string | null
  >(null);
  const [isJokerPopoverOpen, setIsJokerPopoverOpen] = useState(false);
  const [missedDayRestoreTapState, setMissedDayRestoreTapState] =
    useState<MissedDayRestoreTapState>({
      dateKey: "",
      count: 0,
      lastTappedAt: 0,
    });
  const [, setHistoryRevision] = useState(0);

  function getSavedStreakProtectionState(): StreakProtectionState {
    const savedStreakProtectionState = localStorage.getItem(
      STREAK_PROTECTION_KEY,
    );

    if (savedStreakProtectionState) {
      try {
        const parsedState = JSON.parse(
          savedStreakProtectionState,
        ) as Partial<StreakProtectionState>;

        return {
          jokerCount:
            typeof parsedState.jokerCount === "number"
              ? Math.min(
                  MAX_STREAK_JOKER_COUNT,
                  Math.max(0, parsedState.jokerCount),
                )
              : MAX_STREAK_JOKER_COUNT,
          lastRegeneratedAt:
            typeof parsedState.lastRegeneratedAt === "string"
              ? parsedState.lastRegeneratedAt
              : new Date().toISOString(),
          protectedDateKeyList: Array.isArray(parsedState.protectedDateKeyList)
            ? parsedState.protectedDateKeyList.filter(
                (dateKey): dateKey is string => typeof dateKey === "string",
              )
            : [],
          bestStreak:
            typeof parsedState.bestStreak === "number"
              ? Math.max(0, parsedState.bestStreak)
              : 0,
        };
      } catch (error) {
        console.error("Unable to parse streak protection state", error);
      }
    }

    return {
      jokerCount: 0,
      lastRegeneratedAt: new Date().toISOString(),
      protectedDateKeyList: [],
      bestStreak: 0,
    };
  }

  const [streakProtectionState, setStreakProtectionState] =
    useState<StreakProtectionState>(getSavedStreakProtectionState);

  const openExerciseIllustration = (exerciseName: string) => {
    setSelectedExerciseName(exerciseName);
  };

  const closeExerciseIllustration = () => {
    setSelectedExerciseName(null);
  };

  function getWorkoutDayDate(date = new Date()) {
    const workoutDayDate = new Date(date);

    if (workoutDayDate.getHours() < WORKOUT_DAY_START_HOUR) {
      workoutDayDate.setDate(workoutDayDate.getDate() - 1);
    }

    return workoutDayDate;
  }

  function getSavedWorkoutLevel(): WorkoutLevel {
    const currentWorkoutLevel = getCurrentWorkoutLevel();
    const legacyWorkoutPlanKey = localStorage.getItem(
      SELECTED_WORKOUT_PLAN_KEY,
    );

    if (
      !localStorage.getItem(CURRENT_WORKOUT_LEVEL_KEY) &&
      (legacyWorkoutPlanKey === "debutant" ||
        legacyWorkoutPlanKey === "entraine" ||
        legacyWorkoutPlanKey === "bien_entraine" ||
        legacyWorkoutPlanKey === "sportif_haut_niveau")
    ) {
      const migratedWorkoutLevel =
        legacyWorkoutPlanKey === "debutant" ? "base" : legacyWorkoutPlanKey;
      localStorage.setItem(CURRENT_WORKOUT_LEVEL_KEY, migratedWorkoutLevel);
      return migratedWorkoutLevel;
    }

    return currentWorkoutLevel;
  }

  const [currentWorkoutLevel, setCurrentWorkoutLevel] =
    useState<WorkoutLevel>(getSavedWorkoutLevel);

  const selectedWorkoutPlan = WORKOUT_PLAN_BY_LEVEL[currentWorkoutLevel];

  function formatWorkoutDateKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function getWorkoutDoneKey(date: Date) {
    return `workout_done_${formatWorkoutDateKey(date)}`;
  }

  function hasWorkoutPlanned(date: Date) {
    const dayName = dayNames[date.getDay()];

    return selectedWorkoutPlan.weekly_plan.some(
      (workout) => workout.day === dayName,
    );
  }

  function getDateFromWorkoutDoneKey(dateKey: string) {
    const datePart = dateKey.replace("workout_done_", "");
    const [year, month, day] = datePart.split("-").map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  }

  function getCompletedOrProtectedDateKeyList(
    protectionState: StreakProtectionState,
  ) {
    const dateKeySet = new Set<string>(protectionState.protectedDateKeyList);

    for (let index = 0; index < localStorage.length; index++) {
      const storageKey = localStorage.key(index);

      if (!storageKey || !storageKey.startsWith("workout_done_")) {
        continue;
      }

      if (isWorkoutCompleted(storageKey)) {
        dateKeySet.add(storageKey);
      }
    }

    return [...dateKeySet].sort();
  }

  function regenerateStreakJokers(
    protectionState: StreakProtectionState,
    workoutDayDate: Date,
  ): StreakProtectionState {
    const lastRegeneratedAtTime = new Date(
      protectionState.lastRegeneratedAt,
    ).getTime();

    if (!Number.isFinite(lastRegeneratedAtTime)) {
      return {
        ...protectionState,
        lastRegeneratedAt: workoutDayDate.toISOString(),
      };
    }

    const elapsedWeekCount = Math.floor(
      (workoutDayDate.getTime() - lastRegeneratedAtTime) /
        STREAK_JOKER_REGENERATION_DURATION,
    );

    if (elapsedWeekCount <= 0) {
      return protectionState;
    }

    return {
      ...protectionState,
      jokerCount: Math.min(
        MAX_STREAK_JOKER_COUNT,
        protectionState.jokerCount + elapsedWeekCount,
      ),
      lastRegeneratedAt: workoutDayDate.toISOString(),
    };
  }

  function hasCompletedOrProtectedWorkoutBefore(
    date: Date,
    protectionState: StreakProtectionState,
  ) {
    const dateKeySet = new Set(
      getCompletedOrProtectedDateKeyList(protectionState),
    );
    const dateToCheck = new Date(date);

    for (let checkedDayCount = 0; checkedDayCount < 366; checkedDayCount++) {
      dateToCheck.setDate(dateToCheck.getDate() - 1);

      if (!hasWorkoutPlanned(dateToCheck)) {
        continue;
      }

      if (dateKeySet.has(getWorkoutDoneKey(dateToCheck))) {
        return true;
      }
    }

    return false;
  }

  function getBestStreakRunList(
    protectionState: StreakProtectionState,
    workoutDayDate: Date,
  ): StreakRunSummary[] {
    const protectedDateKeySet = new Set(protectionState.protectedDateKeyList);
    const completedOrProtectedDateKeyList =
      getCompletedOrProtectedDateKeyList(protectionState);
    const firstDateKey = completedOrProtectedDateKeyList[0];
    const firstDate = firstDateKey
      ? getDateFromWorkoutDoneKey(firstDateKey)
      : null;

    if (!firstDate) {
      return [];
    }

    const currentWorkoutDay = new Date(
      workoutDayDate.getFullYear(),
      workoutDayDate.getMonth(),
      workoutDayDate.getDate(),
    );
    const todayDateKey = getWorkoutDoneKey(currentWorkoutDay);
    const shouldSkipToday = !isWorkoutCompleted(todayDateKey);
    const streakRunList: StreakRunSummary[] = [];
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

    for (
      let date = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth(),
        firstDate.getDate(),
      );
      date <= currentWorkoutDay;
      date.setDate(date.getDate() + 1)
    ) {
      if (!hasWorkoutPlanned(date)) {
        continue;
      }

      const dateKey = getWorkoutDoneKey(date);

      if (shouldSkipToday && dateKey === todayDateKey) {
        continue;
      }

      if (
        isWorkoutCompleted(dateKey) ||
        protectedDateKeySet.has(dateKey)
      ) {
        currentRunDateKeyList.push(dateKey);

        if (protectedDateKeySet.has(dateKey)) {
          currentRunJokerDateKeyList.push(dateKey);
        }

        continue;
      }

      pushCurrentRun();
    }

    pushCurrentRun();

    return streakRunList
      .sort((firstRun, secondRun) => {
        if (firstRun.length !== secondRun.length) {
          return secondRun.length - firstRun.length;
        }

        return secondRun.endDateKey.localeCompare(firstRun.endDateKey);
      })
      .slice(0, 5);
  }

  function getStreakAnalysis(
    workoutDayDate: Date,
    currentProtectionState: StreakProtectionState,
  ): StreakAnalysis {
    let protectionState = regenerateStreakJokers(
      currentProtectionState,
      workoutDayDate,
    );
    const protectedDateKeySet = new Set(protectionState.protectedDateKeyList);
    let streak = 0;
    const dateToCheck = new Date(workoutDayDate);

    const isTodayCompleted = isWorkoutCompleted(getWorkoutDoneKey(dateToCheck));

    if (!isTodayCompleted) {
      dateToCheck.setDate(dateToCheck.getDate() - 1);
    }

    for (let checkedDayCount = 0; checkedDayCount < 366; checkedDayCount++) {
      if (!hasWorkoutPlanned(dateToCheck)) {
        dateToCheck.setDate(dateToCheck.getDate() - 1);
        continue;
      }

      const dateKey = getWorkoutDoneKey(dateToCheck);
      const isWorkoutDone = isWorkoutCompleted(dateKey);
      const isWorkoutProtected = protectedDateKeySet.has(dateKey);

      if (isWorkoutDone || isWorkoutProtected) {
        streak += 1;
        dateToCheck.setDate(dateToCheck.getDate() - 1);
        continue;
      }

      if (
        protectionState.jokerCount <= 0 ||
        !hasCompletedOrProtectedWorkoutBefore(dateToCheck, protectionState)
      ) {
        break;
      }

      protectedDateKeySet.add(dateKey);
      protectionState = {
        ...protectionState,
        jokerCount: protectionState.jokerCount - 1,
        protectedDateKeyList: [...protectedDateKeySet].sort(),
      };
      streak += 1;
      dateToCheck.setDate(dateToCheck.getDate() - 1);
    }

    const bestStreakRunList = getBestStreakRunList(
      protectionState,
      workoutDayDate,
    );
    const bestCurrentRunLength = bestStreakRunList[0]?.length ?? 0;
    protectionState = {
      ...protectionState,
      bestStreak: Math.max(
        protectionState.bestStreak,
        streak,
        bestCurrentRunLength,
      ),
    };

    return {
      streak,
      protectionState,
      bestStreakRunList,
    };
  }

  const handleWorkoutLevelChange = (workoutLevel: WorkoutLevel) => {
    setCurrentWorkoutLevel(workoutLevel);
    localStorage.setItem(CURRENT_WORKOUT_LEVEL_KEY, workoutLevel);
    setShouldShowLevelUpSuggestion(false);

    setCurrentExerciseIndex(0);
    setCurrentCircuit(1);
    setIsFinisher(false);
    setIsResting(false);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  const today = new Date();
  const workoutDayDate = getWorkoutDayDate(today);
  const todayKey = `workout_done_${formatWorkoutDateKey(workoutDayDate)}`;
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const todayName = dayNames[workoutDayDate.getDay()];

  const todayWorkout = selectedWorkoutPlan.weekly_plan.find(
    (workout) => workout.day === todayName,
  );
  const isRestDay = todayName === "Thursday";

  const streakAnalysis = getStreakAnalysis(
    workoutDayDate,
    streakProtectionState,
  );
  const currentStreak = streakAnalysis.streak;

  const frenchDayNames = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  const getMonthProgress = (monthDate: Date) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const currentWorkoutDay = new Date(
      workoutDayDate.getFullYear(),
      workoutDayDate.getMonth(),
      workoutDayDate.getDate(),
    );

    let completedWorkoutCount = 0;
    let plannedWorkoutCount = 0;
    const missedCountByDayName: Record<string, number> = {};

    for (
      let date = new Date(year, month, 1);
      date <= lastDayOfMonth;
      date.setDate(date.getDate() + 1)
    ) {
      const calendarDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );

      const isFutureWorkoutDay = calendarDay > currentWorkoutDay;

      if (isFutureWorkoutDay) {
        continue;
      }

      if (!hasWorkoutPlanned(calendarDay)) {
        continue;
      }

      const isWorkoutDone = isWorkoutCompleted(getWorkoutDoneKey(calendarDay));

      const isCurrentWorkoutDay =
        calendarDay.getTime() === currentWorkoutDay.getTime();

      if (isCurrentWorkoutDay && !isWorkoutDone) {
        continue;
      }

      plannedWorkoutCount += 1;

      if (isWorkoutDone) {
        completedWorkoutCount += 1;
        continue;
      }

      const frenchDayName = frenchDayNames[calendarDay.getDay()];
      missedCountByDayName[frenchDayName] =
        (missedCountByDayName[frenchDayName] ?? 0) + 1;
    }

    const successPercentage =
      plannedWorkoutCount === 0
        ? 0
        : Math.round((completedWorkoutCount / plannedWorkoutCount) * 100);

    const worstMissedDayEntry = Object.entries(missedCountByDayName).sort(
      ([, firstCount], [, secondCount]) => secondCount - firstCount,
    )[0];

    return {
      successPercentage,
      completedWorkoutCount,
      plannedWorkoutCount,
      worstMissedDayName: worstMissedDayEntry?.[0] ?? null,
      worstMissedDayCount: worstMissedDayEntry?.[1] ?? 0,
    };
  };

  const getMonthStats = (monthDate: Date): MonthStats => {
    const currentMonthProgress = getMonthProgress(monthDate);
    const previousMonthProgress = getMonthProgress(
      new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1),
    );

    return {
      ...currentMonthProgress,
      previousSuccessPercentage: previousMonthProgress.successPercentage,
      growthPercentagePoint:
        currentMonthProgress.successPercentage -
        previousMonthProgress.successPercentage,
    };
  };

  useEffect(() => {
    const completed = isWorkoutCompleted(todayKey);
    setIsCompleted(completed);

    const reminder = localStorage.getItem("reminder_enabled") === "true";
    setReminderEnabled(reminder);

    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [todayKey]);

  useEffect(() => {
    const currentProtectionState = JSON.stringify(streakProtectionState);
    const nextProtectionState = JSON.stringify(
      streakAnalysis.protectionState,
    );

    if (currentProtectionState === nextProtectionState) {
      return;
    }

    localStorage.setItem(STREAK_PROTECTION_KEY, nextProtectionState);
    setStreakProtectionState(streakAnalysis.protectionState);
  }, [streakAnalysis.protectionState, streakProtectionState]);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(
      LEVEL_UP_SUGGESTION_DISMISSED_AT_KEY,
    );
    const dismissedAtTime = dismissedAt ? new Date(dismissedAt).getTime() : 0;
    const isSuggestionDismissed =
      Number.isFinite(dismissedAtTime) &&
      Date.now() - dismissedAtTime < LEVEL_UP_SUGGESTION_DISMISSAL_DURATION;
    const savedWorkoutLevel = getCurrentWorkoutLevel();
    const isHighestWorkoutLevel =
      savedWorkoutLevel === "sportif_haut_niveau";

    setShouldShowLevelUpSuggestion(
      !isHighestWorkoutLevel &&
        !isSuggestionDismissed &&
        shouldSuggestLevelUp(savedWorkoutLevel),
    );
  }, []);

  useEffect(() => {
    let interval: number;
    if (timerRunning && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const startWorkout = () => {
    setScreen("workout");
    setCurrentExerciseIndex(0);
    setCurrentCircuit(1);
    setIsFinisher(false);
    setIsResting(false);
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  useEffect(() => {
    if (isResting && timerSeconds === 0 && !timerRunning) {
      setIsResting(false);
      setCurrentExerciseIndex(0);
    }
  }, [isResting, timerSeconds, timerRunning]);

  const getCurrentExercise = () => {
    if (!todayWorkout) return null;
    if (isFinisher) return todayWorkout.finisher;
    return todayWorkout.exercises[currentExerciseIndex];
  };

  const handleNext = () => {
    if (!todayWorkout) return;

    if (isFinisher) {
      setScreen("complete");
      return;
    }

    if (currentExerciseIndex < todayWorkout.exercises.length - 1) {
      setCurrentExerciseIndex((prev: number) => prev + 1);
      setTimerSeconds(0);
      setTimerRunning(false);
    } else {
      if (currentCircuit < todayWorkout.circuit_repetitions) {
        setCurrentCircuit((prev: number) => prev + 1);
        setTimerSeconds(REST_DURATION);
        setTimerRunning(true);
        setIsResting(true);
      } else {
        setIsFinisher(true);
        setTimerSeconds(0);
        setTimerRunning(false);
      }
    }
  };

  const skipRest = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
    setIsResting(false);
    setCurrentExerciseIndex(0);
  };

  const startTimer = (timeStr: string) => {
    const seconds = parseInt(timeStr.replace(/[^0-9]/g, ""));
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const validateWorkout = () => {
    if (!selectedDifficultyRating || !todayWorkout) {
      return;
    }

    const workoutHistoryItem: WorkoutHistoryItem = {
      dateKey: todayKey,
      isCompleted: true,
      workoutLevel: currentWorkoutLevel,
      difficultyRating: selectedDifficultyRating,
      session: todayWorkout.session,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(todayKey, JSON.stringify(workoutHistoryItem));
    setIsCompleted(true);
    setScreen("home");
    setSelectedDifficultyRating(null);
  };

  const increaseWorkoutLevel = (): void => {
    const currentWorkoutLevelIndex =
      WORKOUT_LEVEL_LIST.indexOf(currentWorkoutLevel);
    const nextWorkoutLevel = WORKOUT_LEVEL_LIST[currentWorkoutLevelIndex + 1];

    if (!nextWorkoutLevel) {
      return;
    }

    localStorage.setItem(CURRENT_WORKOUT_LEVEL_KEY, nextWorkoutLevel);
    setCurrentWorkoutLevel(nextWorkoutLevel);
    setShouldShowLevelUpSuggestion(false);
  };

  const dismissLevelUpSuggestion = (): void => {
    localStorage.setItem(
      LEVEL_UP_SUGGESTION_DISMISSED_AT_KEY,
      new Date().toISOString(),
    );
    setShouldShowLevelUpSuggestion(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isWorkoutProtectedByJoker = (dateKey: string) =>
    streakAnalysis.protectionState.protectedDateKeyList.includes(dateKey);

  const getWorkoutStatus = (date: Date) => {
    const dateKey = `workout_done_${formatWorkoutDateKey(date)}`;
    const isDone = isWorkoutCompleted(dateKey);
    const isProtectedByJoker = isWorkoutProtectedByJoker(dateKey);

    const dayName = dayNames[date.getDay()];
    const isRestDay = dayName === "Thursday";
    const currentWorkoutDay = new Date(
      workoutDayDate.getFullYear(),
      workoutDayDate.getMonth(),
      workoutDayDate.getDate(),
    );

    const calendarDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const isPast = calendarDay < currentWorkoutDay;
    const isToday = calendarDay.getTime() === currentWorkoutDay.getTime();

    if (isDone) return "done";
    if (isProtectedByJoker) return "protected";
    if (isRestDay) return "rest";
    if (isPast && !isToday) return "missed";
    return "future";
  };

  const restoreMissedWorkout = (date: Date) => {
    const dayName = dayNames[date.getDay()];
    const plannedWorkout = selectedWorkoutPlan.weekly_plan.find(
      (workout) => workout.day === dayName,
    );

    if (!plannedWorkout) {
      return;
    }

    const dateKey = getWorkoutDoneKey(date);
    const completedAt = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      12,
      0,
      0,
      0,
    );
    const workoutHistoryItem: WorkoutHistoryItem = {
      dateKey,
      isCompleted: true,
      workoutLevel: currentWorkoutLevel,
      difficultyRating: 3,
      session: plannedWorkout.session,
      completedAt: completedAt.toISOString(),
    };

    localStorage.setItem(dateKey, JSON.stringify(workoutHistoryItem));
    setMissedDayRestoreTapState({
      dateKey: "",
      count: 0,
      lastTappedAt: 0,
    });
    setHistoryRevision((revision) => revision + 1);

    if (dateKey === todayKey) {
      setIsCompleted(true);
    }
  };

  const handleHistoryDayTap = (date: Date, status: string) => {
    if (status !== "missed") {
      return;
    }

    const dateKey = getWorkoutDoneKey(date);
    const now = Date.now();
    const isSameTapSequence =
      missedDayRestoreTapState.dateKey === dateKey &&
      now - missedDayRestoreTapState.lastTappedAt <=
        MISSED_DAY_RESTORE_TAP_DELAY;
    const nextTapCount = isSameTapSequence
      ? missedDayRestoreTapState.count + 1
      : 1;

    if (nextTapCount >= MISSED_DAY_RESTORE_TAP_COUNT) {
      restoreMissedWorkout(date);
      return;
    }

    setMissedDayRestoreTapState({
      dateKey,
      count: nextTapCount,
      lastTappedAt: now,
    });
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  useEffect(() => {
    if (reminderEnabled && notificationPermission === "granted") {
      const checkReminder = () => {
        const now = new Date();
        if (now.getHours() === 18 && now.getMinutes() === 0) {
          const completed = isWorkoutCompleted(todayKey);
          if (!completed) {
            new Notification("Entraînement quotidien", {
              body: "Il est temps de faire votre séance de 15 minutes !",
              icon: "💪",
            });
          }
        }
      };

      const interval = setInterval(checkReminder, 60000);
      return () => clearInterval(interval);
    }
  }, [reminderEnabled, notificationPermission, todayKey]);

  if (screen === "history") {
    const days = getDaysInMonth(currentMonth);
    const monthStats = getMonthStats(currentMonth);
    const monthName = currentMonth.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 pb-24">
        <div className="max-w-md mx-auto pt-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              ←
            </button>
            <h1 className="text-xl text-slate-800 capitalize">{monthName}</h1>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["L", "M", "M", "J", "V", "S", "D"].map((day, idx) => (
                <div
                  key={idx}
                  className="text-center text-xs text-slate-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => {
                if (!day) {
                  return <div key={idx} className="aspect-square" />;
                }

                const status = getWorkoutStatus(day);
                const workoutHistoryItem = getWorkoutHistoryItem(
                  getWorkoutDoneKey(day),
                );
                const isCurrentDay =
                  day.toDateString() === workoutDayDate.toDateString();

                let bgColor = "bg-slate-50";
                let textColor = "text-slate-400";
                let borderColor = "";

                if (status === "done") {
                  bgColor = "bg-green-100";
                  textColor = "text-green-700";
                } else if (status === "protected") {
                  bgColor = "bg-amber-100";
                  textColor = "text-amber-700";
                } else if (status === "missed") {
                  bgColor = "bg-red-100";
                  textColor = "text-red-700";
                } else if (status === "rest") {
                  bgColor = "bg-blue-50";
                  textColor = "text-blue-600";
                }

                if (isCurrentDay) {
                  borderColor = "ring-2 ring-slate-800";
                }

                return (
                  <div
                    key={idx}
                    onClick={() => handleHistoryDayTap(day, status)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg ${bgColor} ${textColor} ${borderColor} text-sm ${
                      status === "missed"
                        ? "cursor-pointer transition-transform active:scale-95"
                        : ""
                    }`}
                  >
                    <span>{day.getDate()}</span>
                    {status === "protected" && (
                      <span className="text-[10px] leading-tight">🃏</span>
                    )}
                    {workoutHistoryItem && (
                      <span className="text-[10px] leading-tight">
                        {
                          WORKOUT_LEVEL_EMOJI_BY_LEVEL[
                            workoutHistoryItem.workoutLevel
                          ]
                        }{" "}
                        {
                          DIFFICULTY_EMOJI_BY_RATING[
                            workoutHistoryItem.difficultyRating
                          ]
                        }
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100"></div>
                <span className="text-slate-600">Fait</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100"></div>
                <span className="text-slate-600">Oublié</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-4 w-4 items-center justify-center rounded bg-amber-100 text-[10px]">
                  🃏
                </div>
                <span className="text-slate-600">Joker</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-50"></div>
                <span className="text-slate-600">Repos</span>
              </div>
            </div>

            <div className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-[11px] leading-relaxed text-slate-500">
              <p>
                🌱 Base · 💪 Entraîné · 🔥 Bien entraîné · ⚡ Sportif haut
                niveau
              </p>
              <p>
                😄 très facile · 🙂 facile · 😐 bien · 😤 difficile · 🥵 trop
                difficile
              </p>
            </div>
          </div>

          <div className="mt-6">
            <MonthStatsCard monthStats={monthStats} />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3">
          <div className="max-w-md mx-auto flex gap-2">
            <button
              onClick={() => setScreen("home")}
              className="flex-1 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Aujourd'hui
            </button>
            <button className="flex-1 py-3 rounded-xl bg-slate-800 text-white">
              Historique
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "home") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 pb-24">
        <div className="max-w-md mx-auto pt-2">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h1 className="text-3xl text-slate-800">Routine 15min</h1>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() =>
                  setIsJokerPopoverOpen(
                    (currentIsJokerPopoverOpen) =>
                      !currentIsJokerPopoverOpen,
                  )
                }
                className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm text-amber-700 transition-colors hover:bg-amber-100"
                aria-label="Voir les jokers de streak"
              >
                <span aria-hidden="true">🃏</span>
                <span>
                  {streakAnalysis.protectionState.jokerCount}/
                  {MAX_STREAK_JOKER_COUNT}
                </span>
              </button>

              {isJokerPopoverOpen && (
                <div className="absolute right-0 top-10 z-20 w-60 rounded-xl border border-amber-100 bg-white p-3 text-xs leading-relaxed text-slate-600 shadow-lg">
                  <p className="text-amber-800">
                    Un joker protege une seance prevue oubliee.
                  </p>
                  <p className="mt-1">
                    Tu en recuperes 1 tous les 7 jours, jusqu'a{" "}
                    {MAX_STREAK_JOKER_COUNT} en stock.
                  </p>
                </div>
              )}
            </div>
          </div>
          <p className="text-slate-500 mb-2">
            {today.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <div className="mb-6">
            <StreakCard
              streak={currentStreak}
              bestStreak={streakAnalysis.protectionState.bestStreak}
              consumedJokerCount={
                streakAnalysis.protectionState.protectedDateKeyList.length
              }
              bestStreakRunList={streakAnalysis.bestStreakRunList}
            />
          </div>

          {shouldShowLevelUpSuggestion &&
            currentWorkoutLevel !== "sportif_haut_niveau" && (
            <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <h2 className="mb-2 text-lg text-green-900">
                Progression disponible
              </h2>
              <p className="mb-4 text-sm text-green-800">
                Tes 3 dernières séances ont été faciles. Tu peux essayer le
                niveau supérieur.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={increaseWorkoutLevel}
                  className="flex-1 rounded-xl bg-green-700 px-4 py-3 text-sm text-white transition-colors hover:bg-green-800"
                >
                  Monter de niveau
                </button>
                <button
                  type="button"
                  onClick={dismissLevelUpSuggestion}
                  className="rounded-xl bg-white px-4 py-3 text-sm text-green-800 transition-colors hover:bg-green-100"
                >
                  Plus tard
                </button>
              </div>
            </div>
          )}

          {isRestDay ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="text-6xl mb-4">🧘</div>
              <h2 className="text-2xl mb-2 text-slate-800">Jour de repos</h2>
              <p className="text-slate-500">
                Profitez de votre journée de récupération
              </p>
            </div>
          ) : todayWorkout ? (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl mb-1 text-slate-800">
                      {todayWorkout.session}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {todayWorkout.circuit_repetitions} circuits
                    </p>
                  </div>
                  {isCompleted && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      ✓ Fait
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  {todayWorkout.exercises.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <ExercisePreviewButton
                          exerciseName={ex.name}
                          onClick={openExerciseIllustration}
                        />
                        <span className="text-slate-700">{ex.name}</span>
                      </div>
                      <span className="text-slate-500 text-sm">
                        {ex.reps || ex.time || ex.instruction}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 bg-slate-50 rounded-lg px-3 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700">
                        Finisher: {todayWorkout.finisher.name}
                      </span>
                    </div>
                    <span className="text-slate-500 text-sm">
                      {todayWorkout.finisher.instruction}
                    </span>
                  </div>
                </div>

                {isCompleted ? (
                  <div className="text-center py-4 text-green-700">
                    <div className="text-5xl mb-2">🎉</div>
                    <p className="text-lg">Séance terminée aujourd'hui</p>
                  </div>
                ) : (
                  <button
                    onClick={startWorkout}
                    className="w-full bg-slate-800 text-white py-4 rounded-xl text-lg hover:bg-slate-700 transition-colors"
                  >
                    Commencer la séance
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <p className="text-slate-500">Aucune séance prévue aujourd'hui</p>
            </div>
          )}
          <div className="mt-6">
            <WorkoutPlanPicker
              selectedWorkoutLevel={currentWorkoutLevel}
              onWorkoutLevelChange={handleWorkoutLevelChange}
            />
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3">
          <div className="max-w-md mx-auto flex gap-2">
            <button className="flex-1 py-3 rounded-xl bg-slate-800 text-white">
              Aujourd'hui
            </button>
            <button
              onClick={() => setScreen("history")}
              className="flex-1 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Historique
            </button>
          </div>
        </div>
        <ExerciseIllustrationModal
          exerciseName={selectedExerciseName}
          onClose={closeExerciseIllustration}
        />
      </div>
    );
  }

  if (screen === "workout" && todayWorkout) {
    if (isResting) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-4 flex flex-col">
          <div className="max-w-md mx-auto w-full flex-1 flex flex-col pt-8">
            <div className="text-center mb-8">
              <p className="text-blue-300 text-sm mb-2">Repos entre circuits</p>
              <p className="text-blue-400 text-xs">
                Circuit {currentCircuit}/{todayWorkout.circuit_repetitions}
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8 text-center">
                <h2 className="text-2xl text-white mb-8">Repos</h2>
                <div className="text-8xl text-white mb-8">{timerSeconds}s</div>
                <p className="text-blue-200 text-sm">
                  Le prochain circuit commence automatiquement
                </p>
              </div>

              <button
                onClick={skipRest}
                className="w-full bg-white/20 text-white py-5 rounded-2xl text-xl hover:bg-white/30 transition-colors"
              >
                Passer le repos
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentExercise = getCurrentExercise();
    if (!currentExercise) return null;

    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 p-4 flex flex-col">
          <div className="max-w-md mx-auto w-full flex-1 flex flex-col pt-8">
            <div className="text-center mb-8">
              <p className="text-slate-400 text-sm mb-2">
                {isFinisher
                  ? "Finisher"
                  : `Circuit ${currentCircuit}/${todayWorkout.circuit_repetitions}`}
              </p>
              {!isFinisher && (
                <p className="text-slate-500 text-xs">
                  Exercice {currentExerciseIndex + 1}/
                  {todayWorkout.exercises.length}
                </p>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8">
                <div className="mb-6 flex items-center justify-center gap-3">
                  <h2 className="text-3xl text-white text-center">
                    {currentExercise.name}
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      openExerciseIllustration(currentExercise.name)
                    }
                    aria-label={`Voir l'exercice ${currentExercise.name}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <EyeIcon />
                  </button>
                </div>

                <div className="text-center">
                  {"reps" in currentExercise && currentExercise.reps && (
                    <div className="text-6xl text-white mb-2">
                      {currentExercise.reps}
                    </div>
                  )}

                  {"instruction" in currentExercise &&
                    currentExercise.instruction && (
                      <div className="text-2xl text-slate-300 mb-4">
                        {currentExercise.instruction}
                      </div>
                    )}

                  {"time" in currentExercise && currentExercise.time && (
                    <div className="space-y-4">
                      {timerSeconds > 0 ? (
                        <div className="text-7xl text-white mb-4">
                          {timerSeconds}s
                        </div>
                      ) : (
                        <div className="text-4xl text-slate-300 mb-4">
                          {currentExercise.time}
                        </div>
                      )}

                      {!timerRunning && timerSeconds === 0 && (
                        <button
                          onClick={() => startTimer(currentExercise.time)}
                          className="bg-white/20 text-white px-8 py-3 rounded-xl hover:bg-white/30 transition-colors"
                        >
                          Démarrer le timer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-white text-slate-900 py-5 rounded-2xl text-xl hover:bg-slate-100 transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
        <ExerciseIllustrationModal
          exerciseName={selectedExerciseName}
          onClose={closeExerciseIllustration}
        />
      </>
    );
  }

  if (screen === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-8xl mb-6">🎯</div>
          <h2 className="text-3xl mb-4 text-slate-800">Bravo !</h2>
          <p className="text-slate-600 mb-8">Vous avez terminé votre séance</p>

          <div className="mb-8 rounded-2xl bg-white p-5 text-left shadow-sm">
            <h3 className="mb-4 text-center text-lg text-slate-800">
              Comment était la séance ?
            </h3>
            <div className="space-y-2">
              {DIFFICULTY_OPTION_LIST.map((difficultyOption) => {
                const isSelected =
                  selectedDifficultyRating === difficultyOption.rating;

                return (
                  <button
                    key={difficultyOption.rating}
                    type="button"
                    onClick={() =>
                      setSelectedDifficultyRating(difficultyOption.rating)
                    }
                    className={
                      isSelected
                        ? "w-full rounded-xl bg-green-100 px-4 py-3 text-left text-green-900 ring-2 ring-green-600"
                        : "w-full rounded-xl bg-slate-50 px-4 py-3 text-left text-slate-700 transition-colors hover:bg-slate-100"
                    }
                  >
                    {difficultyOption.rating}.{" "}
                    {DIFFICULTY_EMOJI_BY_RATING[difficultyOption.rating]}{" "}
                    {difficultyOption.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={validateWorkout}
            disabled={selectedDifficultyRating === null}
            className="bg-green-600 text-white px-8 py-4 rounded-2xl text-xl hover:bg-green-700 transition-colors disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Valider la séance
          </button>
        </div>
      </div>
    );
  }

  return null;
}
