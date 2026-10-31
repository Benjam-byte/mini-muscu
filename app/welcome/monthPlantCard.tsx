import { useState } from "react";
import {
  GROWTH_MULTIPLIER_STEP_LIST,
  GROWTH_STAGE_LIST,
  SEED_SESSION_COUNT,
  formatGrowthMultiplier,
  getGrowthMultiplier,
  getNextGrowthMultiplierStep,
  getSessionsToNextStage,
  getStageProgress,
  type MonthGrowth,
  type StreakRunSummary,
} from "../forest";

type MonthPlantCardProps = {
  monthGrowth: MonthGrowth;
  streak: number;
  bestStreak: number;
  consumedJokerCount: number;
  bestStreakRunList: StreakRunSummary[];
  forest: MonthGrowth[];
};

const FIRST_GROWTH_MULTIPLIER_STEP = GROWTH_MULTIPLIER_STEP_LIST[0];

export const getPlantEmoji = (monthGrowth: MonthGrowth) =>
  monthGrowth.stageIndex >= 2
    ? monthGrowth.species.emoji
    : GROWTH_STAGE_LIST[monthGrowth.stageIndex].emoji;

const formatDateKey = (dateKey: string) => {
  const [, year, month, day] =
    dateKey.match(/^workout_done_(\d{4})-(\d{2})-(\d{2})$/) ?? [];

  if (!year || !month || !day) {
    return dateKey;
  }

  return `${day}/${month}/${year}`;
};

const formatMonthLabel = (monthDate: Date) =>
  monthDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

const pluralize = (count: number, word: string) =>
  `${count} ${word}${count > 1 ? "s" : ""}`;

export function MonthPlantCard({
  monthGrowth,
  streak,
  bestStreak,
  consumedJokerCount,
  bestStreakRunList,
  forest,
}: MonthPlantCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const stage = GROWTH_STAGE_LIST[monthGrowth.stageIndex];
  const nextStage = GROWTH_STAGE_LIST[monthGrowth.stageIndex + 1];
  const sessionsToNextStage = getSessionsToNextStage(monthGrowth, streak);
  const growthMultiplier = getGrowthMultiplier(streak);
  const nextGrowthMultiplierStep = getNextGrowthMultiplierStep(streak);

  const progress =
    nextStage === undefined
      ? 100
      : Math.round(getStageProgress(monthGrowth) * 100);

  const nextStageText =
    nextStage === undefined
      ? "Stade maximal atteint, bravo !"
      : sessionsToNextStage !== null &&
          sessionsToNextStage <= monthGrowth.remainingPlannedCount
        ? `Encore ${pluralize(sessionsToNextStage, "séance")} avant ${nextStage.title}${streak > 0 ? " en gardant ta série" : ""}`
        : "Chaque séance la fait encore grandir.";

  return (
    <>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-green-50 text-6xl">
            {getPlantEmoji(monthGrowth)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-500">Plante du mois</p>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700 transition-colors hover:bg-slate-200"
                aria-label="Voir ma forêt et mes séries"
              >
                i
              </button>
            </div>

            <h2 className="mt-0.5 truncate text-xl text-slate-800">
              {monthGrowth.plantName}
            </h2>

            <p className="text-sm text-slate-500">
              {stage.title} ·{" "}
              {monthGrowth.completedCount}/{monthGrowth.plannedCount} séances
            </p>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-1.5 text-xs text-slate-500">{nextStageText}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {streak === 0 ? (
            <span>
              🔥 Enchaîne {FIRST_GROWTH_MULTIPLIER_STEP.minStreak} jours pour
              accélérer la pousse
            </span>
          ) : (
            <span>
              🔥 {pluralize(streak, "jour")} de suite · croissance{" "}
              <strong className="font-medium">
                {formatGrowthMultiplier(growthMultiplier)}
              </strong>
            </span>
          )}

          <span className="shrink-0 text-xs text-amber-700">
            {nextGrowthMultiplierStep
              ? streak === 0
                ? formatGrowthMultiplier(nextGrowthMultiplierStep.multiplier)
                : `${formatGrowthMultiplier(nextGrowthMultiplierStep.multiplier)} dans ${pluralize(nextGrowthMultiplierStep.minStreak - streak, "jour")}`
              : "Bonus max"}
          </span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-4 sm:items-center">
          <div className="mx-auto max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">
                  {forest.length === 0
                    ? "Aucun arbre planté pour l'instant"
                    : `${pluralize(forest.length, "arbre")} planté${forest.length > 1 ? "s" : ""}`}
                </p>
                <h2 className="mt-1 text-2xl text-slate-800">Ma forêt</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
                aria-label="Fermer ma forêt"
              >
                x
              </button>
            </div>

            <div className="space-y-1.5 rounded-xl bg-green-50 p-4 text-sm leading-relaxed text-green-900">
              <p>
                🌱 Chaque séance fait pousser la plante du mois : graine
                pendant {SEED_SESSION_COUNT} séances, puis pousse, petit arbre
                et arbre. Elle ne régresse jamais.
              </p>
              <p>
                🔥 Ta série accélère la pousse :{" "}
                {GROWTH_MULTIPLIER_STEP_LIST.map(
                  (multiplierStep) =>
                    `${formatGrowthMultiplier(multiplierStep.multiplier)} dès ${multiplierStep.minStreak} jours`,
                ).join(", ")}
                .
              </p>
              <p>🌳 À la fin du mois, elle est plantée dans ta forêt.</p>
            </div>

            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-stretch gap-3">
              <div className="rounded-xl bg-slate-50 p-4 text-center">
                <div className="text-4xl">🔥</div>
                <p className="mt-2 text-xs text-slate-500">Série actuelle</p>
                <p className="mt-1 text-2xl text-slate-800">{streak}</p>
              </div>

              <div className="flex items-center text-xs text-slate-400">vs</div>

              <div className="rounded-xl bg-green-50 p-4 text-center">
                <div className="text-4xl">🏆</div>
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
              <h3 className="mb-3 text-sm text-slate-800">Mois plantés</h3>

              {forest.length === 0 ? (
                <p className="rounded-xl border border-slate-100 p-4 text-sm text-slate-500">
                  Ta première plante rejoindra la forêt à la fin du mois.
                </p>
              ) : (
                <div className="space-y-2">
                  {[...forest].reverse().map((plantedMonthGrowth) => (
                    <div
                      key={plantedMonthGrowth.monthKey}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      <span className="text-3xl">
                        {getPlantEmoji(plantedMonthGrowth)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-slate-800">
                          {plantedMonthGrowth.plantName}
                        </p>
                        <p className="text-xs capitalize text-slate-500">
                          {formatMonthLabel(plantedMonthGrowth.monthDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-700">
                          {GROWTH_STAGE_LIST[plantedMonthGrowth.stageIndex].title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {plantedMonthGrowth.completedCount}/
                          {plantedMonthGrowth.plannedCount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5">
              <h3 className="mb-3 text-sm text-slate-800">
                Meilleures séries
              </h3>

              {bestStreakRunList.length === 0 ? (
                <p className="rounded-xl border border-slate-100 p-4 text-sm text-slate-500">
                  Termine une séance pour créer ton premier record.
                </p>
              ) : (
                <div className="-mx-5 overflow-x-auto px-5 pb-1">
                  <div className="flex gap-3">
                    {bestStreakRunList.map((streakRun, index) => (
                      <div
                        key={`${streakRun.startDateKey}-${streakRun.endDateKey}`}
                        className="w-40 shrink-0 rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                            🔥{" "}
                            {formatGrowthMultiplier(
                              getGrowthMultiplier(streakRun.length),
                            )}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                            #{index + 1}
                          </span>
                        </div>

                        <p className="mt-3 text-lg text-slate-800">
                          {pluralize(streakRun.length, "jour")}
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
                    ))}
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
