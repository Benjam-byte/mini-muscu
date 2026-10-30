import type { DailyWorkout } from "./workout";

export type RestDayScheduleEntry = {
  startDateKey: string;
  restDay: number;
};

export const REST_DAY_SCHEDULE_KEY = "rest_day_schedule";
export const DEFAULT_REST_DAY = 4;

export const REST_DAY_OPTION_LIST: {
  day: number;
  shortLabel: string;
  label: string;
}[] = [
  { day: 1, shortLabel: "L", label: "Lundi" },
  { day: 2, shortLabel: "M", label: "Mardi" },
  { day: 3, shortLabel: "M", label: "Mercredi" },
  { day: 4, shortLabel: "J", label: "Jeudi" },
  { day: 5, shortLabel: "V", label: "Vendredi" },
  { day: 6, shortLabel: "S", label: "Samedi" },
  { day: 0, shortLabel: "D", label: "Dimanche" },
];

const isValidRestDay = (restDay: unknown): restDay is number =>
  typeof restDay === "number" &&
  Number.isInteger(restDay) &&
  restDay >= 0 &&
  restDay <= 6;

export const getSavedRestDaySchedule = (): RestDayScheduleEntry[] => {
  try {
    const savedRestDaySchedule = localStorage.getItem(REST_DAY_SCHEDULE_KEY);

    if (!savedRestDaySchedule) {
      return [];
    }

    const parsedRestDaySchedule = JSON.parse(savedRestDaySchedule) as unknown;

    if (!Array.isArray(parsedRestDaySchedule)) {
      return [];
    }

    return parsedRestDaySchedule
      .filter(
        (entry): entry is RestDayScheduleEntry =>
          typeof entry === "object" &&
          entry !== null &&
          typeof entry.startDateKey === "string" &&
          isValidRestDay(entry.restDay),
      )
      .sort((firstEntry, secondEntry) =>
        firstEntry.startDateKey.localeCompare(secondEntry.startDateKey),
      );
  } catch (error) {
    console.error("Unable to parse rest day schedule", error);
    return [];
  }
};

export const getRestDayForDate = (
  restDaySchedule: RestDayScheduleEntry[],
  dateKey: string,
): number => {
  let restDay = DEFAULT_REST_DAY;

  for (const entry of restDaySchedule) {
    if (entry.startDateKey > dateKey) {
      break;
    }

    restDay = entry.restDay;
  }

  return restDay;
};

export const getNextRestDaySchedule = (
  restDaySchedule: RestDayScheduleEntry[],
  restDay: number,
  startDateKey: string,
): RestDayScheduleEntry[] => {
  const previousRestDaySchedule = restDaySchedule.filter(
    (entry) => entry.startDateKey < startDateKey,
  );

  if (getRestDayForDate(previousRestDaySchedule, startDateKey) === restDay) {
    return previousRestDaySchedule;
  }

  return [...previousRestDaySchedule, { startDateKey, restDay }];
};

const getMondayBasedDayIndex = (day: number) => (day + 6) % 7;

// Les séances sont réparties dans l'ordre à partir de lundi, en sautant le
// jour de repos : avec jeudi, Lun S1, Mar S2, Mer S3, Ven S4, Sam S5, Dim S6.
export const getPlannedWorkoutForDay = (
  weeklyPlan: DailyWorkout[],
  day: number,
  restDay: number,
): DailyWorkout | null => {
  if (day === restDay) {
    return null;
  }

  const dayIndex = getMondayBasedDayIndex(day);
  const restDayIndex = getMondayBasedDayIndex(restDay);
  const sessionIndex = dayIndex > restDayIndex ? dayIndex - 1 : dayIndex;

  return weeklyPlan[sessionIndex] ?? null;
};
