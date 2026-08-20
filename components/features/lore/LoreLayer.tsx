"use client";

import { useEffect } from "react";

import { useMapStore } from "@/stores/mapStore";
import { useLore } from "@/hooks/useLore";
import { preloadScareAssets } from "@/hooks/scarePreloader";

import LoreMarker from "./LoreMarker";

export default function LoreLayer() {
  const mode = useMapStore((state) => state.mode);
  const { data: stories = [], isLoading, error } = useLore();

  // Preload scare assets when entering lore mode.
  useEffect(() => {
    if (mode === "lore") {
      preloadScareAssets();
    }
  }, [mode]);

  if (mode !== "lore" || isLoading) {
    return null;
  }

  if (error) {
    console.error("LoreLayer: failed to load stories", error);
    return null;
  }

  // TODO: Replace with the user's actual setting.
  const jumpScaresEnabled = true;

  return (
    <>
      {stories.map((story) => (
        <LoreMarker
          key={story.id}
          spot={story}
          jumpScaresEnabled={jumpScaresEnabled}
        />
      ))}
    </>
  );
}
