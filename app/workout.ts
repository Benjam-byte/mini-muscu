export const EXERCISE_IMAGE_BY_NAME: Record<string, string> = {
  Pompes: "/exercises/pompes.png",
  "Pompes lentes": "/exercises/pompes.png",
  "Pompes + squats": "/exercises/pompes.png",

  Squats: "/exercises/squats.png",
  "Squat hold": "/exercises/squats.png",
  "Squat lent": "/exercises/squats.png",

  Gainage: "/exercises/gainage.png",
  "Planche avant": "/exercises/gainage.png",

  "Planche latérale": "/exercises/gainage-latérale.png",
  "Planche latérale gauche": "/exercises/gainage-latérale.png",
  "Planche latérale droite": "/exercises/gainage-latérale.png",

  "Planche shoulder taps": "/exercises/planche-shoulder-taps.png",

  "Mountain climbers": "/exercises/moutain-climbers.png",
  "Mountain climbers lents": "/exercises/moutain-climbers.png",

  Fentes: "/exercises/fentes.png",
  "Fentes bulgares": "/exercises/fente-bulagres.png",

  "Glute bridge": "/exercises/glute-bridge.png",

  "Pompes serrées": "/exercises/pompes-serrées.png",

  "Dips (lit/chaise)": "/exercises/dips.png",

  Superman: "/exercises/superman.png",

  "Wall sit": "/exercises/wall-sit.png",

  "Squat une jambe assisté": "/exercises/squat-jambe-assisté.png",

  Burpees: "/exercises/burpies.png",
};

export const WORKOUT_PLAN = {
  weekly_plan: [
    {
      day: "Monday",
      session: "S1 - Base équilibre",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes", reps: "12" },
        { name: "Squats", reps: "15" },
        { name: "Gainage", time: "45s" },
        { name: "Mountain climbers", time: "30s" },
      ],
      finisher: {
        name: "Pompes lentes",
        instruction: "jusqu'à quasi échec",
      },
    },
    {
      day: "Tuesday",
      session: "S2 - Bas du corps focus",
      circuit_repetitions: 2,
      exercises: [
        { name: "Fentes", reps: "10/jambe" },
        { name: "Glute bridge", reps: "15" },
        { name: "Squats", reps: "10" },
        { name: "Wall sit", time: "45s" },
      ],
      finisher: {
        name: "Squat hold",
        instruction: "statique max",
      },
    },
    {
      day: "Wednesday",
      session: "S3 - Haut du corps focus",
      circuit_repetitions: 2,
      exercises: [
        { name: "Pompes serrées", reps: "8" },
        { name: "Dips (lit/chaise)", reps: "10" },
        { name: "Superman", reps: "15" },
        { name: "Planche shoulder taps", time: "30s" },
      ],
      finisher: {
        name: "Pompes",
        instruction: "max",
      },
    },
    {
      day: "Friday",
      session: "S4 - Core & gainage",
      circuit_repetitions: 2,
      exercises: [
        {
          name: "Planche avant",
          time: "30s",
        },
        {
          name: "Planche shoulder taps",
          reps: "20",
        },
        {
          name: "Planche latérale gauche",
          time: "30s",
        },
        {
          name: "Planche latérale droite",
          time: "30s",
        },
        {
          name: "Mountain climbers lents",
          reps: "20",
        },
      ],
      finisher: {
        name: "Gainage",
        instruction: "max",
      },
    },
    {
      day: "Saturday",
      session: "S5 - Unilatéral",
      circuit_repetitions: 2,
      exercises: [
        { name: "Squat une jambe assisté", reps: "6/jambe" },
        { name: "Fentes bulgares", reps: "8/jambe" },
        { name: "Pompes", reps: "8" },
        { name: "Planche latérale", time: "30s/côté" },
      ],
      finisher: {
        name: "Squat lent",
        instruction: "max",
      },
    },
    {
      day: "Sunday",
      session: "S6 - Full body intense",
      circuit_repetitions: 3,
      exercises: [
        { name: "Pompes", instruction: "max" },
        { name: "Squats", reps: "20" },
        { name: "Gainage", time: "30s" },
        { name: "Burpees", reps: "10" },
      ],
      finisher: {
        name: "Pompes + squats",
        instruction: "sans pause max",
      },
    },
  ],
};

export const WORKOUT_PLAN_ENTRAINE = {
  weekly_plan: [
    {
      day: "Monday",
      session: "S1 - Base équilibre",
      circuit_repetitions: 3,
      exercises: [
        { name: "Pompes", reps: "18" },
        { name: "Squats", reps: "25" },
        { name: "Gainage", time: "60s" },
        { name: "Mountain climbers", time: "45s" },
      ],
      finisher: { name: "Pompes lentes", instruction: "jusqu'à quasi échec" },
    },
    {
      day: "Tuesday",
      session: "S2 - Bas du corps focus",
      circuit_repetitions: 3,
      exercises: [
        { name: "Fentes", reps: "14/jambe" },
        { name: "Glute bridge une jambe", reps: "12/jambe" },
        { name: "Squats", reps: "20" },
        { name: "Wall sit", time: "60s" },
      ],
      finisher: { name: "Squat hold", instruction: "statique max" },
    },
    {
      day: "Wednesday",
      session: "S3 - Haut du corps focus",
      circuit_repetitions: 3,
      exercises: [
        { name: "Pompes serrées", reps: "12" },
        { name: "Dips (lit/chaise)", reps: "15" },
        { name: "Superman", reps: "20" },
        { name: "Planche shoulder taps", time: "45s" },
      ],
      finisher: { name: "Pompes", instruction: "max" },
    },
    {
      day: "Friday",
      session: "S4 - Core & gainage",
      circuit_repetitions: 3,
      exercises: [
        { name: "Planche avant", time: "45s" },
        { name: "Planche shoulder taps", reps: "30" },
        { name: "Planche latérale gauche", time: "45s" },
        { name: "Planche latérale droite", time: "45s" },
        { name: "Mountain climbers lents", reps: "30" },
      ],
      finisher: { name: "Gainage", instruction: "max" },
    },
    {
      day: "Saturday",
      session: "S5 - Unilatéral",
      circuit_repetitions: 3,
      exercises: [
        { name: "Squat une jambe assisté", reps: "10/jambe" },
        { name: "Fentes bulgares", reps: "12/jambe" },
        { name: "Pompes", reps: "15" },
        { name: "Planche latérale", time: "45s/côté" },
      ],
      finisher: { name: "Squat lent", instruction: "max" },
    },
    {
      day: "Sunday",
      session: "S6 - Full body intense",
      circuit_repetitions: 3,
      exercises: [
        { name: "Pompes", instruction: "max - 2 reps" },
        { name: "Squats", reps: "30" },
        { name: "Gainage", time: "45s" },
        { name: "Burpees", reps: "15" },
      ],
      finisher: { name: "Pompes + squats", instruction: "sans pause max" },
    },
  ],
};

export const WORKOUT_PLAN_BIEN_ENTRAINE = {
  weekly_plan: [
    {
      day: "Monday",
      session: "S1 - Base équilibre",
      circuit_repetitions: 4,
      exercises: [
        { name: "Pompes", reps: "25" },
        { name: "Squats sautés", reps: "25" },
        { name: "Gainage", time: "75s" },
        { name: "Mountain climbers", time: "60s" },
      ],
      finisher: { name: "Pompes lentes", instruction: "jusqu'à quasi échec" },
    },
    {
      day: "Tuesday",
      session: "S2 - Bas du corps focus",
      circuit_repetitions: 4,
      exercises: [
        { name: "Fentes sautées", reps: "12/jambe" },
        { name: "Glute bridge une jambe", reps: "15/jambe" },
        { name: "Squats tempo lent", reps: "20" },
        { name: "Wall sit", time: "75s" },
      ],
      finisher: { name: "Squat hold", instruction: "statique max" },
    },
    {
      day: "Wednesday",
      session: "S3 - Haut du corps focus",
      circuit_repetitions: 4,
      exercises: [
        { name: "Pompes serrées", reps: "18" },
        { name: "Dips (lit/chaise)", reps: "20" },
        { name: "Superman hold", time: "45s" },
        { name: "Planche shoulder taps", reps: "40" },
      ],
      finisher: { name: "Pompes", instruction: "max" },
    },
    {
      day: "Friday",
      session: "S4 - Core & gainage",
      circuit_repetitions: 4,
      exercises: [
        { name: "Planche avant", time: "60s" },
        { name: "Planche shoulder taps", reps: "40" },
        { name: "Planche latérale gauche", time: "60s" },
        { name: "Planche latérale droite", time: "60s" },
        { name: "Mountain climbers lents", reps: "40" },
      ],
      finisher: { name: "Hollow hold", instruction: "max" },
    },
    {
      day: "Saturday",
      session: "S5 - Unilatéral",
      circuit_repetitions: 4,
      exercises: [
        { name: "Squat une jambe assisté", reps: "12/jambe" },
        { name: "Fentes bulgares", reps: "16/jambe" },
        { name: "Pompes", reps: "22" },
        { name: "Planche latérale", time: "60s/côté" },
      ],
      finisher: { name: "Squat lent", instruction: "max" },
    },
    {
      day: "Sunday",
      session: "S6 - Full body intense",
      circuit_repetitions: 4,
      exercises: [
        { name: "Pompes", instruction: "max - 2 reps" },
        { name: "Squats sautés", reps: "25" },
        { name: "Gainage", time: "60s" },
        { name: "Burpees", reps: "18" },
      ],
      finisher: { name: "Pompes + squats", instruction: "sans pause max" },
    },
  ],
};

export const WORKOUT_PLAN_SPORTIF_HAUT_NIVEAU = {
  weekly_plan: [
    {
      day: "Monday",
      session: "S1 - Base équilibre",
      circuit_repetitions: 5,
      exercises: [
        { name: "Pompes explosives", reps: "20" },
        { name: "Squats sautés", reps: "30" },
        { name: "Gainage", time: "90s" },
        { name: "Mountain climbers", time: "75s" },
      ],
      finisher: { name: "Pompes lentes", instruction: "jusqu'à échec" },
    },
    {
      day: "Tuesday",
      session: "S2 - Bas du corps focus",
      circuit_repetitions: 5,
      exercises: [
        { name: "Fentes sautées", reps: "16/jambe" },
        { name: "Glute bridge une jambe", reps: "20/jambe" },
        { name: "Squats pistol assistés", reps: "10/jambe" },
        { name: "Wall sit", time: "90s" },
      ],
      finisher: { name: "Squat hold", instruction: "statique max" },
    },
    {
      day: "Wednesday",
      session: "S3 - Haut du corps focus",
      circuit_repetitions: 5,
      exercises: [
        { name: "Pompes serrées", reps: "25" },
        { name: "Dips (lit/chaise)", reps: "25" },
        { name: "Superman hold", time: "60s" },
        { name: "Planche shoulder taps", reps: "60" },
      ],
      finisher: { name: "Pompes", instruction: "max" },
    },
    {
      day: "Friday",
      session: "S4 - Core & gainage",
      circuit_repetitions: 5,
      exercises: [
        { name: "Planche avant", time: "90s" },
        { name: "Planche shoulder taps", reps: "60" },
        { name: "Planche latérale gauche", time: "75s" },
        { name: "Planche latérale droite", time: "75s" },
        { name: "Mountain climbers lents", reps: "60" },
      ],
      finisher: { name: "Hollow hold", instruction: "max" },
    },
    {
      day: "Saturday",
      session: "S5 - Unilatéral",
      circuit_repetitions: 5,
      exercises: [
        { name: "Squat une jambe assisté", reps: "15/jambe" },
        { name: "Fentes bulgares sautées", reps: "12/jambe" },
        { name: "Pompes explosives", reps: "20" },
        { name: "Planche latérale", time: "75s/côté" },
      ],
      finisher: { name: "Squat lent", instruction: "max" },
    },
    {
      day: "Sunday",
      session: "S6 - Full body intense",
      circuit_repetitions: 5,
      exercises: [
        { name: "Pompes", instruction: "max - 2 reps" },
        { name: "Squats sautés", reps: "35" },
        { name: "Gainage", time: "75s" },
        { name: "Burpees", reps: "25" },
      ],
      finisher: { name: "Pompes + squats", instruction: "sans pause max" },
    },
  ],
};
