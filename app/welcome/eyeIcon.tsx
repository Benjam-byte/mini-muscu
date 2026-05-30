type ExercisePreviewButtonProps = {
  exerciseName: string;
  onClick: (exerciseName: string) => void;
};

export function ExercisePreviewButton({
  exerciseName,
  onClick,
}: ExercisePreviewButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(exerciseName)}
      aria-label={`Voir l'exercice ${exerciseName}`}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
    >
      <EyeIcon />
    </button>
  );
}

type EyeIconProps = {
  className?: string;
};

export function EyeIcon({ className = "h-4 w-4" }: EyeIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.25 12s3.5-6.75 9.75-6.75S21.75 12 21.75 12 18.25 18.75 12 18.75 2.25 12 2.25 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
