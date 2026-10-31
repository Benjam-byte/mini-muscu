import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ForestSceneData } from "../forest";
import type { ForestEngine, ForestMode } from "../forest/forestEngine";

// Le dégradé sert de ciel derrière le canvas transparent, d'écran de
// chargement et de repli si WebGL est indisponible.
const BACKGROUND_BY_MODE: Record<ForestMode, string> = {
  home: "linear-gradient(180deg, #9fd3f0 0%, #cde9f8 55%, #e8f4fb 100%)",
  workout: "linear-gradient(180deg, #0b1222 0%, #18223a 55%, #25324d 100%)",
};

let forestEnginePromise: Promise<ForestEngine | null> | null = null;
let loadedForestEngine: ForestEngine | null = null;

// three.js est chargé à part, sans bloquer le premier affichage.
export const loadForestEngine = (): Promise<ForestEngine | null> => {
  forestEnginePromise ??= import("../forest/forestEngine")
    .then(({ getForestEngine }) => {
      loadedForestEngine = getForestEngine();
      return loadedForestEngine;
    })
    .catch((error) => {
      console.error("Unable to load forest scene", error);
      forestEnginePromise = null;
      return null;
    });

  return forestEnginePromise;
};

type ForestViewProps = {
  mode: ForestMode;
  sceneData: ForestSceneData;
  cameraStep?: number;
  className?: string;
};

export function ForestView({
  mode,
  sceneData,
  cameraStep = 0,
  className = "",
}: ForestViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<ForestEngine | null>(
    () => loadedForestEngine,
  );

  useEffect(() => {
    if (engine) {
      return;
    }

    let isCancelled = false;

    loadForestEngine().then((forestEngine) => {
      if (!isCancelled) {
        setEngine(forestEngine);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [engine]);

  // Effets de layout : les données sont prêtes et le canvas est en place
  // avant le premier affichage de l'écran.
  useLayoutEffect(() => {
    engine?.setData(sceneData);
  }, [engine, sceneData]);

  useLayoutEffect(() => {
    engine?.setCameraStep(cameraStep);
  }, [engine, cameraStep]);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!engine || !container) {
      return;
    }

    engine.attach(container, mode);

    return () => engine.detach(container);
  }, [engine, mode]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`overflow-hidden ${className}`}
      style={{ background: BACKGROUND_BY_MODE[mode] }}
    />
  );
}
