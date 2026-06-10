import {
  WORKOUT_LEVEL_EMOJI_BY_LEVEL,
  type WorkoutLevel,
} from "../workoutHistory";

const WORKOUT_PLAN_OPTION_LIST: {
  key: WorkoutLevel;
  title: string;
  description: string;
  emoji: string;
}[] = [
  {
    key: "base",
    title: "Débutant",
    description: "Routine simple pour construire l’habitude.",
    emoji: WORKOUT_LEVEL_EMOJI_BY_LEVEL.base,
  },
  {
    key: "entraine",
    title: "Entraîné",
    description: "Plus de volume, mais encore raisonnable.",
    emoji: WORKOUT_LEVEL_EMOJI_BY_LEVEL.entraine,
  },
  {
    key: "bien_entraine",
    title: "Bien entraîné",
    description: "Séances plus solides et plus intenses.",
    emoji: WORKOUT_LEVEL_EMOJI_BY_LEVEL.bien_entraine,
  },
  {
    key: "sportif_haut_niveau",
    title: "Sportif haut niveau",
    description: "Version dure, à choisir si tu récupères bien.",
    emoji: WORKOUT_LEVEL_EMOJI_BY_LEVEL.sportif_haut_niveau,
  },
];

type WorkoutPlanPickerProps = {
  selectedWorkoutLevel: WorkoutLevel;
  onWorkoutLevelChange: (workoutLevel: WorkoutLevel) => void;
};

export function WorkoutPlanPicker({
  selectedWorkoutLevel,
  onWorkoutLevelChange,
}: WorkoutPlanPickerProps) {
  const selectedWorkoutPlanOption = WORKOUT_PLAN_OPTION_LIST.find(
    (workoutPlanOption) => workoutPlanOption.key === selectedWorkoutLevel,
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
            const isSelected = workoutPlanOption.key === selectedWorkoutLevel;

            return (
              <button
                key={workoutPlanOption.key}
                type="button"
                onClick={() => onWorkoutLevelChange(workoutPlanOption.key)}
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
