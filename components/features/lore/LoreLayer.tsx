"use client";

import { useMapStore } from "@/stores/mapStore";
import { useLore } from "@/hooks/useLore";

import LoreMarker from "./LoreMarker";

export default function LoreLayer() {
  const mode = useMapStore((state) => state.mode);
  const { data: stories = [], isLoading, error } = useLore();

  if (mode !== "lore" || isLoading) {
    return null;
  }

  if (error) {
    console.error("LoreLayer: failed to load stories", error);
    return null;
  }

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
