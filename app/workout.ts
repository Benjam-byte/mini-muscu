export type FinisherPerformance =
  | {
      type: "repetitions";
      unit: "repetitions" | "tours";
    }
  | {
      type: "duration";
      unit: "seconds";
    };

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

export const EXERCISE_IMAGE_BY_NAME: Record<string, string> = {
  Pompes: "/exercises/pompes.png",
  "Pompes lentes": "/exercises/pompes.png",
  "Pompes serrées lentes": "/exercises/pompes-serrées.png",
  "Pompes avec pause basse": "/exercises/pompes.png",
  "Pompes serrées avec pause basse": "/exercises/pompes-serrées.png",
  "Pompes archer assistées": "/exercises/pompes.png",
  "Pompes archer": "/exercises/archer poimpe.png",

  "Squats lents": "/exercises/squats.png",
  "Squats lents avec pause": "/exercises/squats.png",
  "Split squat hold": "/exercises/split squat hold.png",
  "Fentes bulgares lentes": "/exercises/fente-bulagres.png",
  "Fentes bulgares lentes avec pause": "/exercises/fente-bulagres.png",
  "Squat une jambe assisté": "/exercises/squat-jambe-assisté.png",

  "Reverse Snow Angels": "/exercises/reverse snow angel.png",
  "W Hold au sol": "/exercises/w-hold.png",

  "Glute bridge": "/exercises/glute-bridge.png",
  "Glute bridge hold": "/exercises/glute-bridge.png",
  "Glute bridge une jambe": "/exercises/unilateral glute bridge.png",
  "Glute bridge une jambe avec pause": "/exercises/unilateral glute bridge.png",
  "Glute bridge une jambe hold": "/exercises/unilateral glute bridge.png",

  "Montées de mollets lentes": "/exercises/montees-mollets.png",
  "Montées de mollets une jambe": "/exercises/montees-mollets.png",
  "Montées de mollets une jambe avec pause": "/exercises/montees-mollets.png",

  "Planche avant": "/exercises/gainage.png",
  "Planche longue": "/exercises/gainage.png",
  "Planche latérale": "/exercises/gainage-latérale.png",
  "Planche latérale avec jambe levée":
    "/exercises/planche lateral jambe levee.png",
  "Planche shoulder taps très lents": "/exercises/planche-shoulder-taps.png",
  "Dead bug lent": "/exercises/dead bug.png",
  "Dead bug jambes tendues": "/exercises/dead bug.png",
  "Bird dog lent": "/exercises/superman.png",
  "Bird dog avec pause": "/exercises/superman.png",

  "Wall sit": "/exercises/wall-sit.png",
};

export const EXERCISE_DESCRIPTION_BY_NAME: Record<string, string> = {
  Pompes: `
Position de planche, corps bien aligné :

- place les mains légèrement plus larges que les épaules ;
- descends la poitrine vers le sol ;
- garde les coudes légèrement orientés vers l’arrière ;
- pousse dans les mains pour revenir en position haute ;
- garde le ventre et les fessiers contractés.
`,

  "Pompes lentes": `
Effectue des pompes à vitesse **très lente** :

- descends pendant environ 3 secondes ;
- approche la poitrine du sol sans t’écraser ;
- marque une courte pause ;
- remonte lentement et de façon contrôlée ;
- garde le corps parfaitement aligné.
`,

  "Pompes serrées lentes": `
Effectue des pompes serrées à vitesse **très lente** :

- place les mains proches l’une de l’autre sous la poitrine ;
- garde les coudes près du corps ;
- descends pendant environ 3 secondes ;
- remonte lentement en poussant fortement dans les triceps ;
- garde le corps gainé.
`,

  "Pompes avec pause basse": `
Effectue une pompe contrôlée avec une pause en bas :

- descends jusqu’à quelques centimètres du sol ;
- maintiens la position basse environ 2 secondes ;
- garde les abdominaux et les fessiers contractés ;
- remonte sans rebond ;
- conserve un mouvement propre à chaque répétition.
`,

  "Pompes serrées avec pause basse": `
Effectue une pompe serrée avec une pause en position basse :

- place les mains proches sous la poitrine ;
- garde les coudes près du corps ;
- descends lentement ;
- reste environ 2 secondes près du sol ;
- pousse fortement pour remonter sans perdre le gainage.
`,

  "Pompes archer assistées": `
Position de pompe avec les mains assez écartées :

- déplace progressivement ton poids vers un bras ;
- plie principalement ce bras pendant la descente ;
- garde l’autre bras plus tendu pour t’aider ;
- remonte puis alterne de côté ;
- utilise autant d’assistance que nécessaire pour garder le mouvement propre.
`,

  "Pompes archer": `
Position de pompe avec les mains largement écartées :

- déplace presque tout ton poids vers un bras ;
- plie ce bras pendant que l’autre reste presque tendu ;
- descends la poitrine vers la main du bras qui travaille ;
- pousse pour revenir au centre ;
- alterne les côtés.
`,

  "Squats lents": `
Debout, pieds environ largeur des épaules, à vitesse **très lente** :

- pousse les hanches vers l’arrière ;
- plie les genoux en descendant pendant environ 3 secondes ;
- garde les talons au sol ;
- descends aussi bas que possible confortablement ;
- remonte lentement en poussant dans les jambes.
`,

  "Squats lents avec pause": `
Effectue un squat lent avec une pause en bas :

- descends pendant environ 3 secondes ;
- garde les genoux dans l’axe des pieds ;
- maintiens la position basse environ 2 secondes ;
- garde le dos stable ;
- remonte lentement sans rebond.
`,

  "Split squat hold": `
Place une jambe devant et une jambe derrière :

- descends verticalement jusqu’à avoir les deux genoux fléchis ;
- garde le pied avant entièrement au sol ;
- maintiens cette position sans bouger ;
- garde le buste droit ;
- change de jambe après le temps indiqué.
`,

  "Fentes bulgares lentes": `
Place le pied arrière sur un support stable :

- garde le pied avant suffisamment loin devant ;
- descends lentement sur la jambe avant ;
- contrôle la descente pendant environ 3 secondes ;
- pousse dans le pied avant pour remonter ;
- garde le bassin stable.
`,

  "Fentes bulgares lentes avec pause": `
Place le pied arrière sur un support stable :

- descends lentement sur la jambe avant ;
- arrête-toi en position basse ;
- maintiens environ 2 secondes ;
- remonte sans élan ;
- garde le genou avant dans l’axe du pied.
`,

  "Squat une jambe assisté": `
Tiens-toi légèrement à un support stable :

- lève légèrement une jambe devant toi ;
- descends sur l’autre jambe de façon contrôlée ;
- utilise le support uniquement pour garder l’équilibre ;
- pousse dans la jambe au sol pour remonter ;
- change de côté après les répétitions prévues.
`,

  "Reverse Snow Angels": `
Allongé sur le ventre à vitesse **très lente** :

- garde les bras tendus devant toi ;
- décolle légèrement les mains du sol ;
- fais-les glisser lentement en arc de cercle jusqu’aux hanches ;
- reviens lentement devant ;
- garde les omoplates serrées.
`,

  "W Hold au sol": `
Allongé sur le ventre, forme un **W** avec les bras :

- plie les coudes et rapproche-les des côtes ;
- décolle légèrement les mains et les coudes du sol ;
- rapproche les omoplates ;
- maintiens la contraction ;
- garde la nuque dans une position naturelle.
`,

  "Glute bridge": `
Allongé sur le dos, genoux pliés :

- pose les pieds à plat près des fessiers ;
- pousse dans les talons ;
- monte le bassin jusqu’à aligner épaules, hanches et genoux ;
- contracte fortement les fessiers en haut ;
- redescends lentement.
`,

  "Glute bridge hold": `
Allongé sur le dos, genoux pliés :

- pousse dans les talons pour lever le bassin ;
- monte jusqu’à aligner épaules, hanches et genoux ;
- contracte fortement les fessiers ;
- maintiens la position sans laisser le bassin descendre ;
- garde les abdominaux légèrement contractés.
`,

  "Glute bridge une jambe": `
Allongé sur le dos :

- garde un pied au sol et lève l’autre jambe ;
- pousse dans le talon de la jambe au sol ;
- monte le bassin sans le faire tourner ;
- contracte le fessier en haut ;
- redescends lentement puis change de jambe.
`,

  "Glute bridge une jambe avec pause": `
Allongé sur le dos avec un seul pied au sol :

- monte lentement le bassin ;
- garde les hanches parallèles ;
- maintiens environ 2 secondes en position haute ;
- contracte fortement le fessier ;
- redescends lentement.
`,

  "Glute bridge une jambe hold": `
Allongé sur le dos avec un seul pied au sol :

- pousse dans le talon pour lever le bassin ;
- garde l’autre jambe décollée ;
- maintiens les hanches parallèles ;
- contracte fortement le fessier ;
- conserve la position jusqu’à la fin du temps prévu.
`,

  "Montées de mollets lentes": `
Debout, pieds parallèles :

- monte lentement sur la pointe des pieds ;
- contracte les mollets en position haute ;
- marque une courte pause ;
- redescends très lentement ;
- évite de rebondir entre les répétitions.
`,

  "Montées de mollets une jambe": `
Debout sur une seule jambe :

- garde éventuellement un doigt contre un mur pour l’équilibre ;
- monte le talon aussi haut que possible ;
- contracte le mollet en haut ;
- redescends lentement ;
- change de jambe après les répétitions prévues.
`,

  "Montées de mollets une jambe avec pause": `
Debout sur une seule jambe :

- monte lentement sur la pointe du pied ;
- maintiens la position haute environ 2 secondes ;
- contracte fortement le mollet ;
- redescends lentement ;
- évite tout rebond.
`,

  "Planche avant": `
En appui sur les avant-bras et les pieds :

- place les coudes sous les épaules ;
- forme une ligne droite de la tête aux talons ;
- contracte les abdominaux et les fessiers ;
- évite de creuser le bas du dos ;
- maintiens la position sans bouger.
`,

  "Planche longue": `
En position de planche avant :

- garde les coudes sous les épaules ;
- contracte fortement les abdominaux ;
- serre les fessiers ;
- garde le bassin à la même hauteur ;
- maintiens une position propre pendant toute la durée.
`,

  "Planche latérale": `
Allongé sur le côté, en appui sur un avant-bras :

- place le coude sous l’épaule ;
- lève le bassin ;
- aligne épaules, hanches et pieds ;
- contracte les abdominaux ;
- maintiens la position puis change de côté.
`,

  "Planche latérale avec jambe levée": `
En position de planche latérale :

- garde le bassin haut et stable ;
- décolle lentement la jambe supérieure ;
- garde les deux jambes tendues ;
- maintiens la position sans tourner le bassin ;
- change de côté après le temps prévu.
`,

  "Planche shoulder taps très lents": `
En position de planche bras tendus, à vitesse **très lente** :

- écarte légèrement les pieds pour être stable ;
- décolle une main ;
- touche lentement l’épaule opposée ;
- repose la main sans faire tourner le bassin ;
- alterne les côtés.
`,

  "Dead bug lent": `
Allongé sur le dos, bras vers le plafond :

- lève les jambes avec les genoux à environ 90° ;
- garde le bas du dos en contact avec le sol ;
- tends lentement un bras et la jambe opposée ;
- reviens au centre ;
- alterne les côtés sans cambrer le dos.
`,

  "Dead bug jambes tendues": `
Allongé sur le dos :

- lève les jambes et garde-les aussi tendues que possible ;
- plaque le bas du dos contre le sol ;
- abaisse lentement une jambe sans toucher le sol ;
- ramène-la avant que le dos ne se cambre ;
- alterne les jambes de façon contrôlée.
`,

  "Bird dog lent": `
À quatre pattes, à vitesse **très lente** :

- garde le dos dans une position neutre ;
- tends simultanément un bras et la jambe opposée ;
- évite de tourner le bassin ;
- reviens lentement au centre ;
- alterne les côtés.
`,

  "Bird dog avec pause": `
À quatre pattes :

- tends un bras et la jambe opposée ;
- garde le bassin parfaitement stable ;
- maintiens la position environ 2 secondes ;
- contracte les abdominaux et les fessiers ;
- reviens lentement puis alterne.
`,

  "Wall sit": `
Dos contre un mur :

- avance légèrement les pieds ;
- descends jusqu’à une position proche d’une chaise ;
- garde le dos contre le mur ;
- garde les pieds entièrement au sol ;
- maintiens la position sans t’aider avec les mains.
`,
};

export const WORKOUT_PLAN: WorkoutPlan = {
  weekly_plan: [
    {
      day: "Monday",
      session: "S1 - Full body équilibre",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Pompes lentes",
          reps: "10",
          instruction: "Descente 3 secondes, courte pause en bas.",
        },
        { name: "Split squat hold", time: "30s/jambe" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        { name: "Glute bridge hold", time: "40s" },
        { name: "Planche latérale", time: "25s/côté" },
      ],
      finisher: {
        name: "Pompes lentes",
        instruction: "Quasi-échec : garder 1-2 répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Tuesday",
      session: "S2 - Bas du corps",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Squats lents",
          reps: "15",
          instruction: "Descente contrôlée en 3 secondes.",
        },
        { name: "Split squat hold", time: "30s/jambe" },
        {
          name: "Glute bridge",
          reps: "18",
          instruction: "Répétitions lentes et contrôlées.",
        },
        {
          name: "Montées de mollets lentes",
          reps: "25",
          instruction: "Marquer une courte pause en haut.",
        },
        { name: "Wall sit", time: "40s" },
      ],
      finisher: {
        name: "Wall sit",
        instruction: "Quasi-échec : arrêter 5-10 secondes avant la limite.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Wednesday",
      session: "S3 - Haut du corps",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Pompes serrées lentes",
          reps: "8",
          instruction: "Garder les coudes proches du corps.",
        },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        {
          name: "Pompes avec pause basse",
          reps: "8",
          instruction: "Pause de 2 secondes près du sol.",
        },
        {
          name: "W Hold au sol",
          time: "30s",
          instruction: "Serrer les omoplates sans cambrer le bas du dos.",
        },
        {
          name: "Planche shoulder taps très lents",
          reps: "12 alternances",
          instruction: "Bassin stable, aucun mouvement rapide.",
        },
      ],
      finisher: {
        name: "Pompes",
        instruction: "Quasi-échec : garder 1-2 répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Friday",
      session: "S4 - Core & contrôle",
      circuit_repetitions: 2,
      exercises: [
        { name: "Planche avant", time: "30s" },
        { name: "Planche latérale", time: "30s/côté" },
        {
          name: "Dead bug lent",
          reps: "10/côté",
          instruction: "Garder le bas du dos au sol.",
        },
        {
          name: "Bird dog lent",
          reps: "10/côté",
          instruction: "Rester stable et contrôler chaque retour.",
        },
        { name: "Glute bridge hold", time: "40s" },
      ],
      finisher: {
        name: "Planche avant",
        instruction: "Quasi-échec : arrêter 5-10 secondes avant la limite.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Saturday",
      session: "S5 - Unilatéral",
      circuit_repetitions: 2,
      exercises: [
        { name: "Squat une jambe assisté", reps: "8/jambe" },
        {
          name: "Fentes bulgares lentes",
          reps: "10/jambe",
          instruction: "Descente contrôlée en 3 secondes.",
        },
        { name: "Pompes lentes", reps: "10" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        { name: "Montées de mollets une jambe", reps: "15/jambe" },
      ],
      finisher: {
        name: "Split squat hold",
        instruction:
          "Chaque jambe à quasi-échec ; noter la durée de la jambe la plus faible.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Sunday",
      session: "S6 - Full body intense",
      circuit_repetitions: 3,
      exercises: [
        { name: "Pompes", instruction: "Maximum moins 2 répétitions." },
        {
          name: "Squats lents",
          reps: "18",
          instruction: "Descente contrôlée en 3 secondes.",
        },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        { name: "Glute bridge une jambe", reps: "10/jambe" },
        { name: "Planche avant", time: "30s" },
      ],
      finisher: {
        name: "Pompes lentes",
        instruction:
          "Quasi-échec ; test maximum optionnel seulement toutes les 1-2 semaines.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
  ],
};

export const WORKOUT_PLAN_ENTRAINE: WorkoutPlan = {
  weekly_plan: [
    {
      day: "Monday",
      session: "S1 - Full body équilibre",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Pompes lentes",
          reps: "14",
          instruction: "Descente 3 secondes, courte pause en bas.",
        },
        { name: "Split squat hold", time: "40s/jambe" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        { name: "Glute bridge hold", time: "50s" },
        { name: "Planche latérale", time: "35s/côté" },
      ],
      finisher: {
        name: "Pompes lentes",
        instruction: "Quasi-échec : garder 1-2 répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Tuesday",
      session: "S2 - Bas du corps",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Squats lents",
          reps: "20",
          instruction: "Descente contrôlée en 3 secondes.",
        },
        { name: "Split squat hold", time: "40s/jambe" },
        { name: "Glute bridge", reps: "22" },
        { name: "Montées de mollets lentes", reps: "30" },
        { name: "Wall sit", time: "55s" },
      ],
      finisher: {
        name: "Wall sit",
        instruction: "Quasi-échec : arrêter 5-10 secondes avant la limite.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Wednesday",
      session: "S3 - Haut du corps",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes serrées lentes", reps: "12" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        {
          name: "Pompes avec pause basse",
          reps: "10",
          instruction: "Pause de 2 secondes près du sol.",
        },
        { name: "W Hold au sol", time: "40s" },
        {
          name: "Planche shoulder taps très lents",
          reps: "16 alternances",
          instruction: "Bassin stable, aucun mouvement rapide.",
        },
      ],
      finisher: {
        name: "Pompes",
        instruction: "Quasi-échec : garder 1-2 répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Friday",
      session: "S4 - Core & contrôle",
      circuit_repetitions: 2,
      exercises: [
        { name: "Planche avant", time: "45s" },
        { name: "Planche latérale", time: "40s/côté" },
        { name: "Dead bug lent", reps: "12/côté" },
        { name: "Bird dog avec pause", reps: "12/côté" },
        { name: "Glute bridge hold", time: "55s" },
      ],
      finisher: {
        name: "Planche avant",
        instruction: "Quasi-échec : arrêter 5-10 secondes avant la limite.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Saturday",
      session: "S5 - Unilatéral",
      circuit_repetitions: 2,
      exercises: [
        { name: "Squat une jambe assisté", reps: "10/jambe" },
        { name: "Fentes bulgares lentes", reps: "14/jambe" },
        { name: "Pompes lentes", reps: "15" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        { name: "Montées de mollets une jambe", reps: "20/jambe" },
      ],
      finisher: {
        name: "Split squat hold",
        instruction:
          "Chaque jambe à quasi-échec ; noter la durée de la jambe la plus faible.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Sunday",
      session: "S6 - Full body intense",
      circuit_repetitions: 3,
      exercises: [
        { name: "Pompes", instruction: "Maximum moins 2 répétitions." },
        { name: "Squats lents", reps: "22" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        { name: "Glute bridge une jambe", reps: "14/jambe" },
        { name: "Planche avant", time: "45s" },
      ],
      finisher: {
        name: "Pompes lentes",
        instruction:
          "Quasi-échec ; test maximum optionnel seulement toutes les 1-2 semaines.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
  ],
};

export const WORKOUT_PLAN_BIEN_ENTRAINE: WorkoutPlan = {
  weekly_plan: [
    {
      day: "Monday",
      session: "S1 - Full body équilibre",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Pompes avec pause basse",
          reps: "12",
          instruction: "Descente 3 secondes, pause de 2 secondes en bas.",
        },
        { name: "Split squat hold", time: "50s/jambe" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        {
          name: "Glute bridge une jambe avec pause",
          reps: "12/jambe",
          instruction: "Pause de 2 secondes en haut.",
        },
        { name: "Planche latérale avec jambe levée", time: "25s/côté" },
      ],
      finisher: {
        name: "Pompes lentes",
        instruction: "Quasi-échec : garder 1-2 répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Tuesday",
      session: "S2 - Bas du corps",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Squats lents avec pause",
          reps: "18",
          instruction: "Descente 3 secondes, pause de 2 secondes en bas.",
        },
        { name: "Fentes bulgares lentes", reps: "12/jambe" },
        { name: "Glute bridge une jambe", reps: "14/jambe" },
        { name: "Montées de mollets une jambe", reps: "18/jambe" },
        { name: "Wall sit", time: "60s" },
      ],
      finisher: {
        name: "Wall sit",
        instruction: "Quasi-échec : arrêter 5-10 secondes avant la limite.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Wednesday",
      session: "S3 - Haut du corps",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Pompes archer assistées",
          reps: "8/côté",
          instruction: "Décharger progressivement le bras d'assistance.",
        },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        {
          name: "Pompes serrées avec pause basse",
          reps: "10",
          instruction: "Pause de 2 secondes près du sol.",
        },
        { name: "W Hold au sol", time: "50s" },
        { name: "Planche shoulder taps très lents", reps: "20 alternances" },
      ],
      finisher: {
        name: "Pompes",
        instruction: "Quasi-échec : garder 1-2 répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Friday",
      session: "S4 - Core & contrôle",
      circuit_repetitions: 2,
      exercises: [
        { name: "Planche longue", time: "35s" },
        { name: "Planche latérale avec jambe levée", time: "25s/côté" },
        { name: "Dead bug jambes tendues", reps: "10/côté" },
        { name: "Bird dog avec pause", reps: "12/côté" },
        { name: "Glute bridge une jambe hold", time: "30s/jambe" },
      ],
      finisher: {
        name: "Planche avant",
        instruction: "Quasi-échec : arrêter 5-10 secondes avant la limite.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Saturday",
      session: "S5 - Unilatéral",
      circuit_repetitions: 2,
      exercises: [
        { name: "Squat une jambe assisté", reps: "12/jambe" },
        {
          name: "Fentes bulgares lentes avec pause",
          reps: "12/jambe",
          instruction: "Pause de 2 secondes en bas.",
        },
        { name: "Pompes archer assistées", reps: "8/côté" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        {
          name: "Montées de mollets une jambe avec pause",
          reps: "18/jambe",
        },
      ],
      finisher: {
        name: "Split squat hold",
        instruction:
          "Chaque jambe à quasi-échec ; noter la durée de la jambe la plus faible.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Sunday",
      session: "S6 - Full body intense",
      circuit_repetitions: 3,
      exercises: [
        {
          name: "Pompes avec pause basse",
          instruction: "Maximum moins 2 répétitions.",
        },
        { name: "Squats lents avec pause", reps: "18" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        { name: "Glute bridge une jambe avec pause", reps: "14/jambe" },
        { name: "Planche longue", time: "35s" },
      ],
      finisher: {
        name: "Pompes lentes",
        instruction:
          "Quasi-échec ; test maximum optionnel seulement toutes les 1-2 semaines.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
  ],
};

export const WORKOUT_PLAN_SPORTIF_HAUT_NIVEAU: WorkoutPlan = {
  weekly_plan: [
    {
      day: "Monday",
      session: "S1 - Full body équilibre",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Pompes archer",
          reps: "8/côté",
          instruction: "Amplitude complète et descente contrôlée.",
        },
        { name: "Split squat hold", time: "60s/jambe" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        { name: "Glute bridge une jambe avec pause", reps: "16/jambe" },
        { name: "Planche latérale avec jambe levée", time: "35s/côté" },
      ],
      finisher: {
        name: "Pompes lentes",
        instruction: "Quasi-échec : garder 1-2 répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Tuesday",
      session: "S2 - Bas du corps",
      circuit_repetitions: 2,
      exercises: [
        { name: "Squat une jambe assisté", reps: "12/jambe" },
        {
          name: "Fentes bulgares lentes avec pause",
          reps: "14/jambe",
          instruction: "Descente 3 secondes, pause de 2 secondes en bas.",
        },
        { name: "Glute bridge une jambe avec pause", reps: "18/jambe" },
        {
          name: "Montées de mollets une jambe avec pause",
          reps: "20/jambe",
        },
        {
          name: "Wall sit",
          time: "60s",
          instruction: "Pieds plus éloignés du mur.",
        },
      ],
      finisher: {
        name: "Wall sit",
        instruction: "Quasi-échec : arrêter 5-10 secondes avant la limite.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Wednesday",
      session: "S3 - Haut du corps",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes archer", reps: "8/côté" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        {
          name: "Pompes serrées avec pause basse",
          reps: "12",
          instruction: "Descente lente et pause de 2 secondes en bas.",
        },
        { name: "W Hold au sol", time: "60s" },
        { name: "Planche shoulder taps très lents", reps: "24 alternances" },
      ],
      finisher: {
        name: "Pompes",
        instruction: "Quasi-échec : garder 1-2 répétitions propres.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
    {
      day: "Friday",
      session: "S4 - Core & contrôle",
      circuit_repetitions: 2,
      exercises: [
        { name: "Planche longue", time: "45s" },
        { name: "Planche latérale avec jambe levée", time: "35s/côté" },
        { name: "Dead bug jambes tendues", reps: "12/côté" },
        { name: "Bird dog avec pause", reps: "14/côté" },
        { name: "Glute bridge une jambe hold", time: "40s/jambe" },
      ],
      finisher: {
        name: "Planche avant",
        instruction: "Quasi-échec : arrêter 5-10 secondes avant la limite.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Saturday",
      session: "S5 - Unilatéral",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Squat une jambe assisté",
          reps: "14/jambe",
          instruction: "Utiliser le moins d'assistance possible.",
        },
        { name: "Fentes bulgares lentes avec pause", reps: "14/jambe" },
        { name: "Pompes archer", reps: "8/côté" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        {
          name: "Montées de mollets une jambe avec pause",
          reps: "22/jambe",
        },
      ],
      finisher: {
        name: "Split squat hold",
        instruction:
          "Chaque jambe à quasi-échec ; noter la durée de la jambe la plus faible.",
        performance: { type: "duration", unit: "seconds" },
      },
    },
    {
      day: "Sunday",
      session: "S6 - Full body intense",
      circuit_repetitions: 3,
      exercises: [
        {
          name: "Pompes archer",
          instruction: "Maximum moins 2 répétitions par côté.",
        },
        { name: "Squat une jambe assisté", reps: "12/jambe" },
        {
          name: "Reverse Snow Angels",
          reps: "12",
          instruction: "Répétitions lentes et contrôlées.",
        },
        { name: "Glute bridge une jambe avec pause", reps: "18/jambe" },
        { name: "Planche longue", time: "45s" },
      ],
      finisher: {
        name: "Pompes lentes",
        instruction:
          "Quasi-échec ; test maximum optionnel seulement toutes les 1-2 semaines.",
        performance: { type: "repetitions", unit: "repetitions" },
      },
    },
  ],
};
