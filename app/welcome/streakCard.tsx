type StreakCardProps = {
  streak: number;
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

export function StreakCard({ streak }: StreakCardProps) {
  const streakStage = getStreakStage(streak);
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-slate-50 text-7xl">
          {streakStage.emoji}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500">Streak actuelle</p>

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
  );
}
