import { REST_DAY_OPTION_LIST, getPlannedWorkoutForDay } from "../restDay";
import type { DailyWorkout } from "../workout";

type RestDayPickerProps = {
  selectedRestDay: number;
  weeklyPlan: DailyWorkout[];
  onRestDayChange: (restDay: number) => void;
};

export function RestDayPicker({
  selectedRestDay,
  weeklyPlan,
  onRestDayChange,
}: RestDayPickerProps) {
  const selectedRestDayOption = REST_DAY_OPTION_LIST.find(
    (restDayOption) => restDayOption.day === selectedRestDay,
  )!;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">Jour de repos</p>
      <p className="text-sm text-slate-800">
        🧘 {selectedRestDayOption.label}
      </p>

      <div className="mt-3 flex justify-between gap-1">
        {REST_DAY_OPTION_LIST.map((restDayOption) => {
          const isSelected = restDayOption.day === selectedRestDay;

          return (
            <button
              key={restDayOption.day}
              type="button"
              onClick={() => onRestDayChange(restDayOption.day)}
              aria-label={restDayOption.label}
              aria-pressed={isSelected}
              title={restDayOption.label}
              className={
                isSelected
                  ? "flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm text-white ring-2 ring-green-400"
                  : "flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700 transition-colors hover:bg-slate-200"
              }
            >
              {restDayOption.shortLabel}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        S'applique dès aujourd'hui. Ton historique n'est pas modifié.
      </p>

      <div className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-xs">
        {REST_DAY_OPTION_LIST.map((restDayOption) => {
          const plannedWorkout = getPlannedWorkoutForDay(
            weeklyPlan,
            restDayOption.day,
            selectedRestDay,
          );

          return (
            <div
              key={restDayOption.day}
              className="flex items-center justify-between gap-3"
            >
              <span className="w-20 shrink-0 text-slate-500">
                {restDayOption.label}
              </span>
              <span
                className={
                  plannedWorkout
                    ? "truncate text-right text-slate-700"
                    : "text-right text-blue-600"
                }
              >
                {plannedWorkout ? plannedWorkout.session : "Repos 🧘"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
