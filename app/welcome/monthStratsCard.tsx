export type MonthStats = {
  successPercentage: number;
  completedWorkoutCount: number;
  plannedWorkoutCount: number;
  worstMissedDayName: string | null;
  worstMissedDayCount: number;
  growthPercentagePoint: number;
  previousSuccessPercentage: number;
};

type CircleProgressProps = {
  percentage: number;
};

function CircleProgress({ percentage }: CircleProgressProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative h-28 w-28">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <circle
          className="text-slate-100"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
        />

        <circle
          className="text-green-500 transition-all duration-500"
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          transform="rotate(-90 50 50)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-slate-800">
          {percentage}%
        </span>
        <span className="text-xs text-slate-400">réussi</span>
      </div>
    </div>
  );
}

type MonthStatsCardProps = {
  monthStats: MonthStats;
};

export function MonthStatsCard({ monthStats }: MonthStatsCardProps) {
  const currentProgressWidth = `${monthStats.successPercentage}%`;
  const previousProgressWidth = `${monthStats.previousSuccessPercentage}%`;

  return (
    <div className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-300">Stats du mois</p>
            <h2 className="text-2xl">Régularité</h2>
          </div>

        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-5">
          <CircleProgress percentage={monthStats.successPercentage} />

          <div className="flex-1">
            <p className="text-sm text-slate-500">Séances réalisées</p>
            <p className="mt-1 text-3xl text-slate-800">
              {monthStats.completedWorkoutCount}
              <span className="text-lg text-slate-400">
                /{monthStats.plannedWorkoutCount}
              </span>
            </p>

            <p className="mt-3 text-sm text-slate-500">
              {monthStats.successPercentage >= 80
                ? "Très bon mois, la routine est solide."
                : monthStats.successPercentage >= 50
                  ? "Mois correct, encore un peu de régularité à gagner."
                  : "Mois compliqué, objectif : reprendre doucement."}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Jour fragile</p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-2xl">
                {monthStats.worstMissedDayCount > 0 ? "🫠" : "✅"}
              </div>

              <div>
                <p className="text-sm text-slate-800">
                  {monthStats.worstMissedDayName ?? "Aucun"}
                </p>
                <p className="text-xs text-slate-500">
                  {monthStats.worstMissedDayCount > 0
                    ? `${monthStats.worstMissedDayCount} oubli${
                        monthStats.worstMissedDayCount > 1 ? "s" : ""
                      }`
                    : "0 oubli"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Évolution</p>

            <div className="mt-3 space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Avant</span>
                  <span>{monthStats.previousSuccessPercentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-400"
                    style={{ width: previousProgressWidth }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Maintenant</span>
                  <span>{monthStats.successPercentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={
                      monthStats.growthPercentagePoint >= 0
                        ? "h-full rounded-full bg-green-500"
                        : "h-full rounded-full bg-red-500"
                    }
                    style={{ width: currentProgressWidth }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
