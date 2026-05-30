import {
  WORKOUT_PLAN,
  WORKOUT_PLAN_ENTRAINE,
  WORKOUT_PLAN_BIEN_ENTRAINE,
  WORKOUT_PLAN_SPORTIF_HAUT_NIVEAU,
} from "../workout";

export const WORKOUT_PLAN_BY_KEY = {
  debutant: WORKOUT_PLAN,
  entraine: WORKOUT_PLAN_ENTRAINE,
  bien_entraine: WORKOUT_PLAN_BIEN_ENTRAINE,
  sportif_haut_niveau: WORKOUT_PLAN_SPORTIF_HAUT_NIVEAU,
};

export type WorkoutPlanKey = keyof typeof WORKOUT_PLAN_BY_KEY;

const WORKOUT_PLAN_OPTION_LIST: {
  key: WorkoutPlanKey;
  title: string;
  description: string;
  emoji: string;
}[] = [
  {
    key: "debutant",
    title: "Débutant",
    description: "Routine simple pour construire l’habitude.",
    emoji: "🌱",
  },
  {
    key: "entraine",
    title: "Entraîné",
    description: "Plus de volume, mais encore raisonnable.",
    emoji: "💪",
  },
  {
    key: "bien_entraine",
    title: "Bien entraîné",
    description: "Séances plus solides et plus intenses.",
    emoji: "🔥",
  },
  {
    key: "sportif_haut_niveau",
    title: "Sportif haut niveau",
    description: "Version dure, à choisir si tu récupères bien.",
    emoji: "⚡",
  },
];

type WorkoutPlanPickerProps = {
  selectedWorkoutPlanKey: WorkoutPlanKey;
  onWorkoutPlanChange: (workoutPlanKey: WorkoutPlanKey) => void;
};

export function WorkoutPlanPicker({
  selectedWorkoutPlanKey,
  onWorkoutPlanChange,
}: WorkoutPlanPickerProps) {
  const selectedWorkoutPlanOption = WORKOUT_PLAN_OPTION_LIST.find(
    (workoutPlanOption) => workoutPlanOption.key === selectedWorkoutPlanKey,
  )!;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500">Programme choisi</p>
          <p className="text-sm text-slate-800">
            {selectedWorkoutPlanOption.emoji} {selectedWorkoutPlanOption.title}
          </p>
        </div>

        <div className="flex gap-2">
          {WORKOUT_PLAN_OPTION_LIST.map((workoutPlanOption) => {
            const isSelected = workoutPlanOption.key === selectedWorkoutPlanKey;

            return (
              <button
                key={workoutPlanOption.key}
                type="button"
                onClick={() => onWorkoutPlanChange(workoutPlanOption.key)}
                aria-label={workoutPlanOption.title}
                title={workoutPlanOption.title}
                className={
                  isSelected
                    ? "flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xl ring-2 ring-green-400"
                    : "flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl transition-colors hover:bg-slate-200"
                }
              >
                {workoutPlanOption.emoji}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {selectedWorkoutPlanOption.description}
      </p>
    </div>
  );
}
