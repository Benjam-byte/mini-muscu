import { EXERCISE_IMAGE_BY_NAME } from "../workout";

function getExerciseImagePath(exerciseName: string): string {
  const imagePath = EXERCISE_IMAGE_BY_NAME[exerciseName];
  return `${import.meta.env.BASE_URL}${imagePath}`;
}

type ExerciseIllustrationModalProps = {
  exerciseName: string | null;
  onClose: () => void;
};

export function ExerciseIllustrationModal({
  exerciseName,
  onClose,
}: ExerciseIllustrationModalProps) {
  if (!exerciseName) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div>
            <p className="text-xs text-slate-500">Illustration</p>
            <h2 className="text-lg text-slate-800">{exerciseName}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-6 w-6 -pt-2 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            ×
          </button>
        </div>

        <div className="bg-slate-50 p-4">
          <img
            src={getExerciseImagePath(exerciseName)}
            alt={`Illustration de l'exercice ${exerciseName}`}
            className="aspect-square w-full rounded-2xl bg-white object-contain p-4"
          />
        </div>

        <div className="p-4">
          <p className="text-sm text-slate-500">
            Regarde la position générale avant de lancer l'exercice.
          </p>
        </div>
      </div>
    </div>
  );
}
