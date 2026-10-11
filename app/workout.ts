/**
 * MiniMuscu — séances courtes, silencieuses et sans matériel sportif.
 *
 * Répartition : 3 full body (lundi / mercredi / samedi),
 * 2 séances légères (mardi / vendredi) et 1 récupération active (dimanche).
 * Jeudi : repos. Le nombre de circuits inclut tous les exercices de la séance.
 *
 * « Rameur » = exercice de renforcement ASSIS avec les mains sous les cuisses ;
 * les jambes fournissent la résistance. Ce n'est ni un ergomètre ni un crunch.
 *
 * Toutes les formes de pont fessier utilisées sont des « Glute bridge walkout ».
 * Garder 1 à 3 répétitions en réserve sur les circuits ;
 * seuls les finishers de lundi et samedi sont volontairement exigeants.
 *
 * IMPORTANT : l'application doit gérer correctement les libellés « /jambe »
 * et « /côté » lors des exercices chronométrés.
 */

export type FinisherPerformance =
  | { type: "repetitions"; unit: "repetitions" | "tours" }
  | { type: "duration"; unit: "seconds" };

export type WorkoutExercise = {
  name: string;
  reps?: string;
  time?: string;
  instruction?: string;
};

export type WorkoutFinisher = {
  name: string;
  instruction: string;
  performance: FinisherPerformance;
};

export type DailyWorkout = {
  day: string;
  session: string;
  circuit_repetitions: number;
  exercises: WorkoutExercise[];
  finisher: WorkoutFinisher;
};

export type WorkoutPlan = {
  weekly_plan: DailyWorkout[];
};

/**
 * Illustrations à ajouter dans public/exercises/ :
 * - pompes-pike.png (nouveau niveau 4)
 * Les autres chemins reprennent les ressources visuelles existantes.
 */
export const EXERCISE_IMAGE_BY_NAME: Record<string, string> = {
  Pompes: "/exercises/pompes.png",
  "Pompes lentes": "/exercises/pompes.png",
  "Pompes serrées lentes": "/exercises/pompes-serrées.png",
  "Pompes avec pause basse": "/exercises/pompes.png",
  "Pompes archer assistées": "/exercises/pompes.png",
  "Pompes archer": "/exercises/archer pompe.png",
  "Pompes pike": "/exercises/pompes-pike.png",

  Squats: "/exercises/squats.png",
  "Squats lents": "/exercises/squats.png",
  "Squats lents avec pause": "/exercises/squats.png",
  "Fentes arrière": "/exercises/fentes.png",
  "Fentes bulgares lentes": "/exercises/fente-bulagres.png",
  "Fentes bulgares lentes avec pause": "/exercises/fente-bulagres.png",
  "Soulevé de terre une jambe": "/exercises/souleve-de-terre-une-jambe.png",
  "Squat une jambe assisté": "/exercises/squat-jambe-assisté.png",
  "Squat une jambe assisté avec pause": "/exercises/squat-jambe-assisté.png",

  Rameur: "/exercises/rameur.png",
  "Glute bridge walkout": "/exercises/glute-bridge-walkout.png",

  "Montées de mollets": "/exercises/montees-mollets.png",
  "Montées de mollets une jambe": "/exercises/montees-mollets.png",
  "Wall sit": "/exercises/wall-sit.png",

  "Planche avant": "/exercises/gainage.png",
  "Planche longue": "/exercises/gainage.png",
  "Planche latérale": "/exercises/gainage-latérale.png",
  "Planche latérale avec jambe levée":
    "/exercises/planche lateral jambe levee.png",
  "Dead bug": "/exercises/dead bug.png",
  "Dead bug lent": "/exercises/dead bug.png",
  "Dead bug jambes tendues": "/exercises/dead bug.png",
  "Bird dog": "/exercises/superman.png",
  "Bird dog avec pause": "/exercises/superman.png",

  "Reverse Snow Angels": "/exercises/reverse snow angel.png",
  "Reverse Snow Angels lents": "/exercises/reverse snow angel.png",
  "W Hold au sol": "/exercises/w-hold.png",
};

/**
 * Aides pour la modale. Éviter toute douleur articulaire ;
 * réduire l'amplitude ou choisir une variante plus simple au besoin.
 */
export const EXERCISE_DESCRIPTION_BY_NAME: Record<string, string> = {
  Pompes: `
En planche, mains légèrement plus larges que les épaules :
- garde la tête, le bassin et les talons alignés ;
- fléchis les coudes en les orientant légèrement vers l'arrière ;
- descends sans laisser tomber le bassin ;
- repousse le sol pour remonter.

Si nécessaire, réalise les pompes sur les genoux ou contre un support stable.
`,

  "Pompes lentes": `
Même position que les pompes classiques :
- descends en environ 3 secondes ;
- garde le corps aligné et les coudes contrôlés ;
- remonte sans rebond ni précipitation ;
- arrête lorsque la technique se dégrade.
`,

  "Pompes serrées lentes": `
En planche, mains un peu plus rapprochées que pour une pompe classique :
- conserve les poignets dans une position confortable ;
- garde les coudes relativement près du corps ;
- descends pendant environ 3 secondes ;
- remonte sans laisser les épaules s'enrouler.
`,

  "Pompes avec pause basse": `
Réalise une pompe contrôlée :
- descends sans creuser le dos ;
- marque 1 à 2 secondes de pause près du sol ;
- remonte en poussant dans les mains ;
- conserve une amplitude indolore.
`,

  "Pompes archer assistées": `
Mains plus écartées qu'en pompe classique :
- déplace ton poids vers un bras pendant la descente ;
- fléchis surtout ce bras et utilise l'autre pour t'aider ;
- remonte puis change de côté ;
- limite l'amplitude si tu perds l'alignement.
`,

  "Pompes archer": `
Mains largement écartées :
- transfère progressivement le poids vers un bras ;
- plie le bras porteur en gardant l'autre presque tendu ;
- pousse pour revenir au centre ;
- alterne les côtés sans forcer sur l'épaule.
`,

  Squats: `
Debout, pieds environ largeur d'épaules :
- recule légèrement les hanches et fléchis les genoux ;
- garde les talons au sol et les genoux dans l'axe des pieds ;
- descends jusqu'à une amplitude confortable ;
- remonte en poussant dans les pieds.
`,

  "Squats lents": `
Squats contrôlés :
- descends sur environ 3 secondes ;
- garde les talons au sol et le dos stable ;
- remonte sans rebond ;
- conserve le même contrôle à chaque répétition.
`,

  "Squats lents avec pause": `
Squats lents avec pause :
- descends en environ 3 secondes ;
- maintiens 1 à 2 secondes en bas, sans rebond ;
- remonte en gardant les genoux alignés avec les pieds ;
- réduis l'amplitude en cas d'inconfort.
`,

  "Fentes arrière": `
Debout :
- recule un pied et descends verticalement ;
- garde le pied avant bien à plat ;
- pousse sur la jambe avant pour revenir ;
- alterne les jambes en contrôlant l'équilibre.
`,

  "Fentes bulgares lentes": `
Pied arrière posé sur un support stable, pied avant suffisamment avancé :
- fléchis la jambe avant en descendant lentement ;
- garde le bassin stable ;
- remonte principalement avec la jambe avant ;
- utilise un appui léger pour l'équilibre si nécessaire.
`,

  "Fentes bulgares lentes avec pause": `
Même installation que pour les fentes bulgares :
- descends lentement sur la jambe avant ;
- marque une pause de 1 à 2 secondes en bas ;
- remonte sans prendre d'élan ;
- change de jambe après les répétitions prévues.
`,

  "Soulevé de terre une jambe": `
Debout, en appui sur une jambe, genou légèrement fléchi :
- penche le buste vers l'avant à partir des hanches ;
- laisse l'autre jambe partir vers l'arrière ;
- conserve le bassin face au sol et le dos neutre ;
- remonte en poussant la hanche vers l'avant.

Tu peux effleurer un mur avec la main pour garder l'équilibre. Sans charge,
ce mouvement travaille surtout le contrôle de hanche et l'équilibre.
`,

  Rameur: `
Rameur de renforcement **sans machine ni serviette** :
- assieds-toi, talons au sol et genoux légèrement pliés ;
- glisse les mains sous les cuisses, juste avant les genoux ;
- tire les cuisses vers le torse avec les bras, coudes près du corps ;
- oppose volontairement une résistance avec les jambes pendant la montée ;
- freine la descente avec les bras tandis que les jambes repoussent ;
- redresse le buste, rapproche les omoplates et respire normalement.

La résistance vient de tes jambes : ne laisse pas les jambes effectuer
tout le mouvement. Augmente progressivement cette opposition, sans à-coups.
`,

  "Glute bridge walkout": `
Allongé sur le dos, genoux fléchis, pieds près des fesses :
- soulève le bassin en contractant les fessiers ;
- avance les talons par petits pas, sans laisser chuter le bassin ;
- avance seulement jusqu'à une distance contrôlable ;
- ramène les talons de la même façon ;
- repose le bassin, puis recommence.

Un aller-retour complet correspond à une répétition. Réduis le nombre
de petits pas si les ischio-jambiers crampent ou si le dos se cambre.
`,

  "Montées de mollets": `
Debout, près d'un mur si nécessaire :
- monte sur la pointe des pieds sans élan ;
- marque une courte pause en haut ;
- redescends lentement ;
- garde les chevilles dans leur axe.
`,

  "Montées de mollets une jambe": `
Debout sur un pied, main près d'un mur pour l'équilibre :
- monte sur l'avant du pied ;
- contrôle la descente ;
- évite de rebondir ;
- répète de l'autre côté.
`,

  "Wall sit": `
Dos contre un mur, pieds légèrement avancés :
- descends jusqu'à une position assise confortable ;
- garde les pieds à plat et les genoux dans l'axe ;
- maintiens sans bloquer la respiration ;
- remonte dès que la posture se dégrade.
`,

  "Planche avant": `
Sur les avant-bras et les pointes de pieds :
- aligne la tête, le bassin et les talons ;
- serre légèrement les abdominaux et les fessiers ;
- respire normalement ;
- arrête avant de creuser le bas du dos.
`,

  "Planche longue": `
Planche avant, mais avec les coudes légèrement avancés devant les épaules :
- conserve le bassin stable et le ventre contracté ;
- garde les épaules actives ;
- respire sans bloquer ;
- rapproche les coudes si la posture se dégrade.
`,

  "Planche latérale": `
Sur le côté, en appui sur un avant-bras :
- place le coude sous l'épaule ;
- soulève les hanches pour aligner le tronc et les jambes ;
- garde le bassin stable et respire ;
- travaille le même temps de chaque côté.
`,

  "Planche latérale avec jambe levée": `
Depuis une planche latérale stable :
- soulève légèrement la jambe du dessus ;
- garde le bassin aligné et le coude sous l'épaule ;
- respire régulièrement ;
- repose la jambe si l'équilibre devient difficile.
`,

  "Dead bug": `
Sur le dos, bras vers le plafond et genoux au-dessus des hanches :
- tends progressivement un bras et la jambe opposée ;
- empêche le bas du dos de se creuser ;
- reviens au centre ;
- alterne lentement les côtés.
`,

  "Dead bug lent": `
Même position que le dead bug :
- allonge lentement un bras et la jambe opposée ;
- marque une petite pause ;
- reviens sans cambrer le bas du dos ;
- alterne les côtés.
`,

  "Dead bug jambes tendues": `
Sur le dos, jambes presque tendues vers le plafond :
- abaisse lentement une jambe jusqu'à la limite de ton contrôle ;
- garde les lombaires stables contre le sol ;
- ramène la jambe ;
- alterne sans chercher à toucher le sol.
`,

  "Bird dog": `
À quatre pattes, dos neutre :
- tends un bras et la jambe opposée ;
- évite de faire tourner le bassin ;
- reviens lentement ;
- alterne les côtés.
`,

  "Bird dog avec pause": `
À quatre pattes :
- tends un bras et la jambe opposée ;
- bloque la rotation du bassin ;
- maintiens 2 secondes ;
- reviens lentement et change de côté.
`,

  "Reverse Snow Angels": `
Allongé sur le ventre, front orienté vers le sol :
- décolle légèrement les mains ;
- dessine un large arc avec les bras, de devant vers les hanches ;
- rapproche les omoplates sans hausser les épaules ;
- reviens doucement à la position initiale.
`,

  "Reverse Snow Angels lents": `
Même mouvement que les Reverse Snow Angels :
- effectue l'aller en environ 3 secondes ;
- marque une courte pause près des hanches ;
- reviens en environ 3 secondes ;
- garde la nuque neutre et les épaules détendues.
`,

  "W Hold au sol": `
Allongé sur le ventre, coudes pliés pour former un W :
- décolle légèrement les mains et les coudes ;
- rapproche doucement les omoplates ;
- garde la nuque alignée ;
- maintiens la position sans bloquer la respiration.
`,

  "Squat une jambe assisté": `
Debout sur une jambe, près d'un support stable :
- garde une main sur le support pour t'équilibrer et moduler l'effort ;
- fléchis progressivement le genou d'appui en reculant les hanches ;
- descends à une amplitude que tu maîtrises ;
- remonte en poussant dans le pied et change de jambe.
`,

  "Squat une jambe assisté avec pause": `
Même mouvement que le squat une jambe assisté :
- descends de façon contrôlée avec une assistance suffisante ;
- maintiens 1 à 2 secondes en bas sans rebond ;
- remonte avec le pied d'appui, en conservant l'alignement du genou ;
- réduis l'amplitude si la stabilité se dégrade.
`,

  "Pompes pike": `
En V inversé, mains au sol à peu près largeur d'épaules :
- place les hanches hautes, jambes plus ou moins fléchies ;
- fléchis les coudes pour approcher la tête du sol devant les mains ;
- pousse dans les mains pour revenir à la position initiale ;
- conserve les épaules actives, la nuque neutre et une amplitude confortable.

Variante exigeante pour les épaules : commence avec une petite amplitude.
`,
};

/** Niveau BASE : apprentissage et répétitions maîtrisées. */
export const WORKOUT_PLAN: WorkoutPlan = {
  weekly_plan: [
    {
      day: "Monday",
      session: "Full body A",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes", reps: "8" },
        { name: "Fentes arrière", reps: "6/jambe" },
        { name: "Rameur", reps: "10" },
        { name: "Glute bridge walkout", reps: "5" },
        { name: "Dead bug", reps: "6/côté" },
      ],
      finisher: {
        name: "Pompes",
        instruction:
          "Une seule série de pompes à 1-2 répétitions de l'échec technique. Note les répétitions propres, sans forcer sur les articulations.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Tuesday",
      session: "Jambes légères & équilibre",
      circuit_repetitions: 2,
      exercises: [
        { name: "Soulevé de terre une jambe", reps: "6/jambe" },
        { name: "Montées de mollets", reps: "20" },
        { name: "Wall sit", time: "30s" },
        { name: "Bird dog", reps: "6/côté" },
        { name: "Planche latérale", time: "20s/côté" },
      ],
      finisher: {
        name: "Montées de mollets",
        instruction:
          "Répétitions contrôlées, sans rechercher l'échec. Note le total effectué avec une technique propre.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Wednesday",
      session: "Full body",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes", reps: "8" },
        { name: "Squats", reps: "12" },
        { name: "Rameur", reps: "10" },
        { name: "Soulevé de terre une jambe", reps: "6/jambe" },
        { name: "Planche latérale", time: "20s/côté" },
      ],
      finisher: {
        name: "Rameur",
        instruction:
          "Rameur contrôlé, résistance modérée des jambes. Arrête avec 2-3 répétitions de réserve et note les répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Friday",
      session: "Core & posture",
      circuit_repetitions: 2,
      exercises: [
        { name: "Dead bug", reps: "4/côté" },
        { name: "W Hold au sol", time: "20s" },
        { name: "Reverse Snow Angels", reps: "8" },
        { name: "Planche avant", time: "20s" },
        { name: "Bird dog", reps: "6/côté" },
      ],
      finisher: {
        name: "Planche avant",
        instruction:
          "Maintien confortable et propre : arrête avant de cambrer ou de trembler fortement. Note le nombre de secondes, sans rechercher un record.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Saturday",
      session: "Full body",
      circuit_repetitions: 2,
      exercises: [
        { name: "Wall sit", time: "30s" },
        { name: "Fentes arrière", reps: "8/jambe" },
        { name: "Rameur", reps: "10" },
        { name: "Planche avant", time: "20s" },
        { name: "Glute bridge walkout", reps: "6" },
      ],
      finisher: {
        name: "Pompes",
        instruction:
          "Une seule série de pompes à 1-2 répétitions de l'échec technique. Note les répétitions propres, sans forcer sur les articulations.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Sunday",
      session: "420",
      circuit_repetitions: 1,
      exercises: [
        { name: "Planche latérale", time: "20s/côté" },
        { name: "Squats", reps: "20" },
        { name: "Montées de mollets", reps: "20" },
        { name: "Rameur", reps: "20" },
      ],
      finisher: {
        name: "Planche avant",
        instruction:
          "Maintien confortable et propre : arrête avant de cambrer ou de trembler fortement. Note le nombre de secondes, sans rechercher un record.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
  ],
};

/** Niveau ENTRAÎNÉ : mêmes exercices que Base, progression douce des répétitions et des durées. */
export const WORKOUT_PLAN_ENTRAINE: WorkoutPlan = {
  weekly_plan: [
    {
      day: "Monday",
      session: "Full body A",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes", reps: "10" },
        { name: "Fentes arrière", reps: "8/jambe" },
        {
          name: "Rameur",
          reps: "12",
          instruction:
            "Oppose une résistance légèrement supérieure avec les jambes.",
        },
        { name: "Glute bridge walkout", reps: "6" },
        { name: "Dead bug", reps: "8/côté" },
      ],
      finisher: {
        name: "Pompes",
        instruction:
          "Une seule série de pompes à 1-2 répétitions de l'échec technique. Note les répétitions propres, sans forcer sur les articulations.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Tuesday",
      session: "Jambes légères & équilibre",
      circuit_repetitions: 2,
      exercises: [
        { name: "Soulevé de terre une jambe", reps: "8/jambe" },
        { name: "Montées de mollets", reps: "24" },
        { name: "Wall sit", time: "35s" },
        { name: "Bird dog", reps: "8/côté" },
        { name: "Planche latérale", time: "25s/côté" },
      ],
      finisher: {
        name: "Montées de mollets",
        instruction:
          "Répétitions contrôlées, sans rechercher l'échec. Note le total effectué avec une technique propre.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Wednesday",
      session: "Full body",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes", reps: "10" },
        { name: "Squats", reps: "14" },
        {
          name: "Rameur",
          reps: "12",
          instruction:
            "Oppose une résistance légèrement supérieure avec les jambes.",
        },
        { name: "Soulevé de terre une jambe", reps: "8/jambe" },
        { name: "Planche latérale", time: "25s/côté" },
      ],
      finisher: {
        name: "Rameur",
        instruction:
          "Rameur contrôlé : résistance modérée des jambes et 2-3 répétitions en réserve. Note les répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Friday",
      session: "Core & posture",
      circuit_repetitions: 2,
      exercises: [
        { name: "Dead bug", reps: "5/côté" },
        { name: "W Hold au sol", time: "25s" },
        { name: "Reverse Snow Angels", reps: "10" },
        { name: "Planche avant", time: "25s" },
        { name: "Bird dog", reps: "8/côté" },
      ],
      finisher: {
        name: "Planche avant",
        instruction:
          "Maintien confortable et propre : arrête avant de cambrer ou de trembler fortement. Note le nombre de secondes, sans rechercher un record.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Saturday",
      session: "Full body",
      circuit_repetitions: 2,
      exercises: [
        { name: "Wall sit", time: "35s" },
        { name: "Fentes arrière", reps: "10/jambe" },
        {
          name: "Rameur",
          reps: "12",
          instruction:
            "Oppose une résistance légèrement supérieure avec les jambes.",
        },
        { name: "Planche avant", time: "25s" },
        { name: "Glute bridge walkout", reps: "7" },
      ],
      finisher: {
        name: "Pompes",
        instruction:
          "Une seule série de pompes à 1-2 répétitions de l'échec technique. Note les répétitions propres, sans forcer sur les articulations.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Sunday",
      session: "420",
      circuit_repetitions: 1,
      exercises: [
        { name: "Planche latérale", time: "20s/côté" },
        { name: "Squats", reps: "20" },
        { name: "Montées de mollets", reps: "20" },
        {
          name: "Rameur",
          reps: "20",
          instruction:
            "Effort facile : ne cherche pas à augmenter la résistance.",
        },
      ],
      finisher: {
        name: "Planche avant",
        instruction:
          "Maintien confortable et propre : arrête avant de cambrer ou de trembler fortement. Note le nombre de secondes, sans rechercher un record.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
  ],
};

/** Niveau BIEN ENTRAÎNÉ : premier palier technique, nouveaux exercices unilatéraux et pompes avancées. */
export const WORKOUT_PLAN_BIEN_ENTRAINE: WorkoutPlan = {
  weekly_plan: [
    {
      day: "Monday",
      session: "Full body A",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes avec pause basse", reps: "8" },
        { name: "Fentes bulgares lentes", reps: "7/jambe" },
        {
          name: "Rameur",
          reps: "12",
          instruction: "Opposition soutenue des jambes, sans accélérer.",
        },
        {
          name: "Glute bridge walkout",
          reps: "7",
          instruction:
            "Éloigne les talons un peu plus loin tout en gardant le bassin stable.",
        },
        { name: "Dead bug jambes tendues", reps: "6/côté" },
      ],
      finisher: {
        name: "Pompes",
        instruction:
          "Une seule série de pompes à 1-2 répétitions de l'échec technique. Note les répétitions propres, sans forcer sur les articulations.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Tuesday",
      session: "Jambes légères & équilibre",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Soulevé de terre une jambe",
          reps: "8/jambe",
          instruction: "Contrôle la descente en 3 secondes.",
        },
        { name: "Montées de mollets une jambe", reps: "10/jambe" },
        { name: "Wall sit", time: "35s" },
        { name: "Bird dog avec pause", reps: "7/côté" },
        { name: "Planche latérale avec jambe levée", time: "15s/côté" },
      ],
      finisher: {
        name: "Montées de mollets une jambe",
        instruction:
          "Répétitions contrôlées, sans rechercher l'échec. Note celles du côté le plus faible, sans à-coups.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Wednesday",
      session: "Full body",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes serrées lentes", reps: "8" },
        { name: "Squat une jambe assisté", reps: "6/jambe" },
        {
          name: "Rameur",
          reps: "12",
          instruction: "Opposition soutenue des jambes.",
        },
        { name: "Soulevé de terre une jambe", reps: "8/jambe" },
        { name: "Planche latérale avec jambe levée", time: "15s/côté" },
      ],
      finisher: {
        name: "Rameur",
        instruction:
          "Rameur contrôlé : résistance modérée des jambes et 2-3 répétitions en réserve. Note les répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Friday",
      session: "Core & posture",
      circuit_repetitions: 2,
      exercises: [
        { name: "Dead bug jambes tendues", reps: "6/côté" },
        { name: "W Hold au sol", time: "30s" },
        { name: "Reverse Snow Angels lents", reps: "8" },
        { name: "Planche longue", time: "20s" },
        { name: "Bird dog avec pause", reps: "7/côté" },
      ],
      finisher: {
        name: "Planche avant",
        instruction:
          "Maintien confortable et propre : arrête avant de cambrer ou de trembler fortement. Note le nombre de secondes, sans rechercher un record.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Saturday",
      session: "Full body",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes archer assistées", reps: "4/côté" },
        { name: "Fentes bulgares lentes", reps: "7/jambe" },
        {
          name: "Rameur",
          reps: "12",
          instruction: "Opposition soutenue des jambes.",
        },
        { name: "Planche avant", time: "30s" },
        {
          name: "Glute bridge walkout",
          reps: "7",
          instruction: "Contrôle chaque aller-retour sans relâcher le bassin.",
        },
      ],
      finisher: {
        name: "Pompes",
        instruction:
          "Une seule série de pompes à 1-2 répétitions de l'échec technique. Note les répétitions propres, sans forcer sur les articulations.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Sunday",
      session: "420",
      circuit_repetitions: 1,
      exercises: [
        { name: "Planche latérale", time: "20s/côté" },
        { name: "Squats", reps: "20" },
        { name: "Montées de mollets", reps: "20" },
        {
          name: "Rameur",
          reps: "20",
          instruction: "Effort facile : séance de récupération, sans fatigue.",
        },
      ],
      finisher: {
        name: "Planche avant",
        instruction:
          "Maintien confortable et propre : arrête avant de cambrer ou de trembler fortement. Note le nombre de secondes, sans rechercher un record.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
  ],
};

/** Niveau SPORTIF HAUT NIVEAU : deuxième palier technique, archer complète, pike et squats sur une jambe. */
export const WORKOUT_PLAN_SPORTIF_HAUT_NIVEAU: WorkoutPlan = {
  weekly_plan: [
    {
      day: "Monday",
      session: "Full body A",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes archer", reps: "5/côté" },
        { name: "Fentes bulgares lentes avec pause", reps: "8/jambe" },
        {
          name: "Rameur",
          reps: "14",
          instruction: "Opposition forte mais sans blocage ni à-coups.",
        },
        {
          name: "Glute bridge walkout",
          reps: "8",
          instruction:
            "Amplitude plus longue si le bassin reste stable, retour lent.",
        },
        { name: "Dead bug jambes tendues", reps: "8/côté" },
      ],
      finisher: {
        name: "Pompes",
        instruction:
          "Une seule série de pompes à 1-2 répétitions de l'échec technique. Note les répétitions propres, sans forcer sur les articulations.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Tuesday",
      session: "Jambes légères & équilibre",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Soulevé de terre une jambe",
          reps: "9/jambe",
          instruction: "Pause de 2 secondes à mi-descente, dos neutre.",
        },
        {
          name: "Montées de mollets une jambe",
          reps: "12/jambe",
          instruction: "Marque une pause de 2 secondes en haut.",
        },
        { name: "Wall sit", time: "40s" },
        { name: "Bird dog avec pause", reps: "8/côté" },
        { name: "Planche latérale avec jambe levée", time: "20s/côté" },
      ],
      finisher: {
        name: "Montées de mollets une jambe",
        instruction:
          "Répétitions contrôlées, sans rechercher l'échec. Note celles du côté le plus faible, sans à-coups.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Wednesday",
      session: "Full body",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes pike", reps: "7" },
        { name: "Squat une jambe assisté avec pause", reps: "6/jambe" },
        {
          name: "Rameur",
          reps: "14",
          instruction: "Opposition forte mais maîtrisée des jambes.",
        },
        {
          name: "Soulevé de terre une jambe",
          reps: "10/jambe",
          instruction: "Pause de 2 secondes en bas, en équilibre.",
        },
        { name: "Planche latérale avec jambe levée", time: "20s/côté" },
      ],
      finisher: {
        name: "Rameur",
        instruction:
          "Rameur contrôlé : résistance modérée des jambes et 2-3 répétitions en réserve. Note les répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Friday",
      session: "Core & posture",
      circuit_repetitions: 2,
      exercises: [
        { name: "Dead bug jambes tendues", reps: "8/côté" },
        { name: "W Hold au sol", time: "35s" },
        { name: "Reverse Snow Angels lents", reps: "10" },
        { name: "Planche longue", time: "25s" },
        { name: "Bird dog avec pause", reps: "9/côté" },
      ],
      finisher: {
        name: "Planche avant",
        instruction:
          "Maintien confortable et propre : arrête avant de cambrer ou de trembler fortement. Note le nombre de secondes, sans rechercher un record.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Saturday",
      session: "Full body",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes archer", reps: "5/côté" },
        { name: "Fentes bulgares lentes avec pause", reps: "8/jambe" },
        {
          name: "Rameur",
          reps: "14",
          instruction: "Opposition forte, contrôlée pendant tout le mouvement.",
        },
        { name: "Planche longue", time: "25s" },
        {
          name: "Glute bridge walkout",
          reps: "8",
          instruction: "Amplitude complète maîtrisée, retour en 3 secondes.",
        },
      ],
      finisher: {
        name: "Pompes",
        instruction:
          "Une seule série de pompes à 1-2 répétitions de l'échec technique. Note les répétitions propres, sans forcer sur les articulations.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Sunday",
      session: "420",
      circuit_repetitions: 1,
      exercises: [
        { name: "Planche latérale", time: "20s/côté" },
        { name: "Squats", reps: "20" },
        { name: "Montées de mollets", reps: "20" },
        {
          name: "Rameur",
          reps: "20",
          instruction:
            "Récupération active : garde une résistance très légère.",
        },
      ],
      finisher: {
        name: "Planche avant",
        instruction:
          "Maintien confortable et propre : arrête avant de cambrer ou de trembler fortement. Note le nombre de secondes, sans rechercher un record.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
  ],
};
