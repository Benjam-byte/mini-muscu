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
        { name: "Glute bridge", reps: "15-20" },
        { name: "Squats", reps: "10-15" },
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
      circuit_repetitions: 3,
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
        { name: "Squat une jambe assisté", reps: "6-10/jambe" },
        { name: "Fentes bulgares", reps: "8-12/jambe" },
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
