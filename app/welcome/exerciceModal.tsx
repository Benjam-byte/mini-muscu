import { Fragment, type ReactNode } from "react";
import {
  EXERCISE_DESCRIPTION_BY_NAME,
  EXERCISE_IMAGE_BY_NAME,
} from "../workout";

const EXERCISE_DESCRIPTION_FALLBACK =
  "Regarde la position générale avant de lancer l'exercice.";

function getExerciseImagePath(exerciseName: string): string {
  const imagePath = EXERCISE_IMAGE_BY_NAME[exerciseName];
  return `${import.meta.env.BASE_URL}${imagePath}`;
}

function renderInlineFormatting(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      const isBold = part.startsWith("**") && part.endsWith("**");

      return (
        <Fragment key={`${part}-${index}`}>
          {isBold ? (
            <strong className="font-semibold text-slate-700">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          )}
        </Fragment>
      );
    });
}

function ExerciseDescription({ description }: { description: string }) {
  const descriptionLines = description
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const introductionLines = descriptionLines.filter(
    (line) => !line.startsWith("- "),
  );
  const instructionLines = descriptionLines
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2));

  return (
    <div className="space-y-3 text-sm leading-6 text-slate-600">
      {introductionLines.map((line, index) => (
        <p key={`${line}-${index}`}>{renderInlineFormatting(line)}</p>
      ))}

      {instructionLines.length > 0 && (
        <ul className="list-disc space-y-2 pl-5">
          {instructionLines.map((line, index) => (
            <li key={`${line}-${index}`}>{renderInlineFormatting(line)}</li>
          ))}
        </ul>
      )}
    </div>
  );
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

  const description = EXERCISE_DESCRIPTION_BY_NAME[exerciseName]?.trim();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 p-4">
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-sm flex-col overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-4">
          <div>
            <p className="text-xs text-slate-500">Illustration</p>
            <h2 className="text-lg text-slate-800">{exerciseName}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 -pt-2 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto">
          <div className="bg-slate-50 p-4">
            <img
              src={getExerciseImagePath(exerciseName)}
              alt={`Illustration de l'exercice ${exerciseName}`}
              className="aspect-square w-full rounded-2xl bg-white object-contain p-4"
            />
          </div>

          <div className="p-4">
            {description ? (
              <ExerciseDescription description={description} />
            ) : (
              <p className="text-sm text-slate-500">
                {EXERCISE_DESCRIPTION_FALLBACK}
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-slate-100 bg-white p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white transition-colors hover:bg-slate-700"
          >
            J’ai compris
          </button>
        </div>
      </div>
    </div>
  );
}
