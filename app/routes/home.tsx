import Welcome from "../welcome/welcome";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mini-muscu" },
    { name: "description", content: "Welcome to Mini-muscu!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
