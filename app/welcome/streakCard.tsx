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

  const nextTarget = nextStage?.minStreak ?? streak;
  const progress =
    nextStage === undefined ? 100 : Math.round((streak / nextTarget) * 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
      <div className="text-7xl mb-3">{streakStage.emoji}</div>

      <h2 className="text-xl text-slate-800">{streak} jours de suite</h2>
      <p className="text-sm text-slate-500 mt-1">{streakStage.description}</p>

      {nextStage && (
        <div className="mt-5">
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Prochaine évolution : {nextStage.title} à {nextStage.minStreak}{" "}
            jours
          </p>
        </div>
      )}
    </div>
  );
}
