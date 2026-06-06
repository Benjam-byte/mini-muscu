import { useEffect, useState } from "react";
import { WORKOUT_PLAN } from "../workout";
import { StreakCard } from "./streakCard";
import { MonthStatsCard, type MonthStats } from "./monthStratsCard";
import {
  WORKOUT_PLAN_BY_KEY,
  WorkoutPlanPicker,
  type WorkoutPlanKey,
} from "./workoutPlanPicker";
import { ExercisePreviewButton, EyeIcon } from "./eyeIcon";
import { ExerciseIllustrationModal } from "./exerciceModal";

type Screen = "home" | "workout" | "complete" | "history";

const REST_DURATION = 60;
const WORKOUT_DAY_START_HOUR = 6;
const SELECTED_WORKOUT_PLAN_KEY = "selected_workout_plan";

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
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>("default");
  const [selectedExerciseName, setSelectedExerciseName] = useState<
    string | null
  >(null);

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

  function getSavedWorkoutPlanKey(): WorkoutPlanKey {
    const savedWorkoutPlanKey = localStorage.getItem(SELECTED_WORKOUT_PLAN_KEY);

    if (
      savedWorkoutPlanKey === "debutant" ||
      savedWorkoutPlanKey === "entraine" ||
      savedWorkoutPlanKey === "bien_entraine" ||
      savedWorkoutPlanKey === "sportif_haut_niveau"
    ) {
      return savedWorkoutPlanKey;
    }

    return "debutant";
  }

  const [selectedWorkoutPlanKey, setSelectedWorkoutPlanKey] =
    useState<WorkoutPlanKey>(getSavedWorkoutPlanKey);

  const selectedWorkoutPlan = WORKOUT_PLAN_BY_KEY[selectedWorkoutPlanKey];

  function formatWorkoutDateKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function getWorkoutDoneKey(date: Date) {
    return `workout_done_${formatWorkoutDateKey(date)}`;
  }

  function hasWorkoutPlanned(date: Date) {
    const dayName = dayNames[date.getDay()];

    return WORKOUT_PLAN.weekly_plan.some((workout) => workout.day === dayName);
  }

  function getCurrentStreak(workoutDayDate: Date) {
    let streak = 0;
    const dateToCheck = new Date(workoutDayDate);

    const isTodayCompleted =
      localStorage.getItem(getWorkoutDoneKey(dateToCheck)) === "true";

    if (!isTodayCompleted) {
      dateToCheck.setDate(dateToCheck.getDate() - 1);
    }

    while (true) {
      if (!hasWorkoutPlanned(dateToCheck)) {
        dateToCheck.setDate(dateToCheck.getDate() - 1);
        continue;
      }

      const isWorkoutDone =
        localStorage.getItem(getWorkoutDoneKey(dateToCheck)) === "true";

      if (!isWorkoutDone) {
        break;
      }

      streak += 1;
      dateToCheck.setDate(dateToCheck.getDate() - 1);
    }

    return streak;
  }

  const handleWorkoutPlanChange = (workoutPlanKey: WorkoutPlanKey) => {
    setSelectedWorkoutPlanKey(workoutPlanKey);
    localStorage.setItem(SELECTED_WORKOUT_PLAN_KEY, workoutPlanKey);

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

  const currentStreak = getCurrentStreak(workoutDayDate);

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

      const isWorkoutDone =
        localStorage.getItem(getWorkoutDoneKey(calendarDay)) === "true";

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
    const completed = localStorage.getItem(todayKey) === "true";
    setIsCompleted(completed);

    const reminder = localStorage.getItem("reminder_enabled") === "true";
    setReminderEnabled(reminder);

    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [todayKey]);

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
    localStorage.setItem(todayKey, "true");
    setIsCompleted(true);
    setScreen("home");
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

  const getWorkoutStatus = (date: Date) => {
    const dateKey = `workout_done_${formatWorkoutDateKey(date)}`;
    const isDone = localStorage.getItem(dateKey) === "true";

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
    if (isRestDay) return "rest";
    if (isPast && !isToday) return "missed";
    return "future";
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
          const completed = localStorage.getItem(todayKey) === "true";
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
                const isCurrentDay =
                  day.toDateString() === workoutDayDate.toDateString();

                let bgColor = "bg-slate-50";
                let textColor = "text-slate-400";
                let borderColor = "";

                if (status === "done") {
                  bgColor = "bg-green-100";
                  textColor = "text-green-700";
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
                    className={`aspect-square flex items-center justify-center rounded-lg ${bgColor} ${textColor} ${borderColor} text-sm`}
                  >
                    {day.getDate()}
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
                <div className="w-4 h-4 rounded bg-blue-50"></div>
                <span className="text-slate-600">Repos</span>
              </div>
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
          <h1 className="text-3xl mb-2 text-slate-800">Routine 15min</h1>
          <p className="text-slate-500 mb-2">
            {today.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <div className="mb-6">
            <StreakCard streak={currentStreak} />
          </div>

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
              selectedWorkoutPlanKey={selectedWorkoutPlanKey}
              onWorkoutPlanChange={handleWorkoutPlanChange}
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

          <button
            onClick={validateWorkout}
            className="bg-green-600 text-white px-8 py-4 rounded-2xl text-xl hover:bg-green-700 transition-colors"
          >
            Valider la séance
          </button>
        </div>
      </div>
    );
  }

  return null;
}
