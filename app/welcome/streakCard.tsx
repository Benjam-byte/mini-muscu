import { useState } from "react";

type StreakCardProps = {
  streak: number;
  bestStreak: number;
  consumedJokerCount: number;
  bestStreakRunList: StreakRunSummary[];
};

export type StreakRunSummary = {
  length: number;
  startDateKey: string;
  endDateKey: string;
  jokerDateKeyList: string[];
};

const STREAK_STAGE_LIST = [
  {
    minStreak: 0,
    emoji: "🌰",
    title: "Graine",
    description: "Commence ta série.",
  },
  {
    minStreak: 2,
    emoji: "🌱",
    title: "Pousse",
    description: "La routine prend racine.",
  },
  {
    minStreak: 5,
    emoji: "🪴",
    title: "Jeune plante",
    description: "Belle régularité.",
  },
  {
    minStreak: 10,
    emoji: "🌿",
    title: "Plante solide",
    description: "Tu construis une vraie habitude.",
  },
  {
    minStreak: 20,
    emoji: "🌳",
    title: "Arbre",
    description: "Ta discipline grandit.",
  },
  {
    minStreak: 30,
    emoji: "🏆",
    title: "Routine légendaire",
    description: "Streak énorme.",
  },
  {
    minStreak: 60,
    emoji: "🌲",
    title: "Forêt naissante",
    description: "Ta routine est devenue solide.",
  },
  {
    minStreak: 90,
    emoji: "🌴",
    title: "Arbre exotique",
    description: "Trois mois de régularité.",
  },
  {
    minStreak: 120,
    emoji: "🍃",
    title: "Maître des feuilles",
    description: "Ton habitude est profondément installée.",
  },
  {
    minStreak: 180,
    emoji: "🗿",
    title: "Discipline ancienne",
    description: "Six mois de constance.",
  },
  {
    minStreak: 250,
    emoji: "🔥",
    title: "Volonté brûlante",
    description: "Tu ne lâches quasiment jamais.",
  },
  {
    minStreak: 666,
    emoji: "😈",
    title: "Démon de la routine",
    description: "Streak totalement absurde.",
  },
];

function getStreakStage(streak: number) {
  return [...STREAK_STAGE_LIST]
    .reverse()
    .find((stage) => streak >= stage.minStreak)!;
}

function formatDateKey(dateKey: string) {
  const [, year, month, day] =
    dateKey.match(/^workout_done_(\d{4})-(\d{2})-(\d{2})$/) ?? [];

  if (!year || !month || !day) {
    return dateKey;
  }

  return `${day}/${month}/${year}`;
}

export function StreakCard({
  streak,
  bestStreak,
  consumedJokerCount,
  bestStreakRunList,
}: StreakCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const streakStage = getStreakStage(streak);
  const bestStreakStage = getStreakStage(bestStreak);
  const nextStage = STREAK_STAGE_LIST.find((stage) => stage.minStreak > streak);

  const currentStageMinStreak = streakStage.minStreak;
  const nextStageMinStreak = nextStage?.minStreak ?? streak;

  const progress =
    nextStage === undefined
      ? 100
      : Math.round(
          ((streak - currentStageMinStreak) /
            (nextStageMinStreak - currentStageMinStreak)) *
            100,
        );

  return (
    <>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-slate-50 text-7xl">
            {streakStage.emoji}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-500">Streak actuelle</p>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700 transition-colors hover:bg-slate-200"
                aria-label="Voir les détails de streak"
              >
                i
              </button>
            </div>

            <h2 className="mt-1 text-xl text-slate-800">
              {streak} jour{streak > 1 ? "s" : ""} de suite
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {streakStage.description}
            </p>

            {nextStage && (
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-green-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Encore {nextStage.minStreak - streak} jour
                  {nextStage.minStreak - streak > 1 ? "s" : ""} avant{" "}
                  {nextStage.title}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-4 sm:items-center">
          <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Détails streak</p>
                <h2 className="mt-1 text-2xl text-slate-800">
                  Actuel vs record
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                aria-label="Fermer les détails de streak"
              >
                x
              </button>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-4xl">{streakStage.emoji}</div>
                <p className="mt-2 text-xs text-slate-500">Actuelle</p>
                <p className="mt-1 text-2xl text-slate-800">{streak}</p>
              </div>

              <div className="flex items-center text-xs text-slate-400">vs</div>

              <div className="rounded-xl bg-green-50 p-4 text-center">
                <div className="text-4xl">{bestStreakStage.emoji}</div>
                <p className="mt-2 text-xs text-green-700">Record</p>
                <p className="mt-1 text-2xl text-green-900">{bestStreak}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-4">
              <p className="text-xs text-amber-700">Jokers consommés</p>
              <p className="mt-1 text-2xl text-amber-900">
                🃏 {consumedJokerCount}
              </p>
            </div>

            <div className="mt-5">
              <h3 className="mb-3 text-sm text-slate-800">
                Meilleures streaks
              </h3>

              {bestStreakRunList.length === 0 ? (
                <p className="rounded-xl border border-slate-100 p-4 text-sm text-slate-500">
                  Termine une séance pour créer ton premier record.
                </p>
              ) : (
                <div className="-mx-5 overflow-x-auto px-5 pb-1">
                  <div className="flex gap-3">
                    {bestStreakRunList.map((streakRun, index) => {
                      const runStage = getStreakStage(streakRun.length);

                      return (
                        <div
                          key={`${streakRun.startDateKey}-${streakRun.endDateKey}`}
                          className="w-40 shrink-0 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-3xl">{runStage.emoji}</span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                              #{index + 1}
                            </span>
                          </div>

                          <p className="mt-3 text-lg text-slate-800">
                            {streakRun.length} jour
                            {streakRun.length > 1 ? "s" : ""}
                          </p>

                          <p className="mt-1 text-xs leading-relaxed text-slate-500">
                            {formatDateKey(streakRun.startDateKey)}
                            <br />
                            {formatDateKey(streakRun.endDateKey)}
                          </p>

                          {streakRun.jokerDateKeyList.length > 0 && (
                            <p className="mt-3 rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-700">
                              🃏 {streakRun.jokerDateKeyList.length}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
