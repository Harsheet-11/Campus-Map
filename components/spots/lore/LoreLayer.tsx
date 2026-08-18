"use client";

import { useMapStore } from "@/stores/mapStore";
import { useLore } from "@/hooks/useLoreStories";
import LoreMarker from "@/components/spots/lore/LoreMarker";

export default function LoreLayer() {
  const mode = useMapStore((s) => s.mode);
  const { data: stories = [] } = useLore();

  if (mode !== "lore") return null;

  return (
    <>
      {stories.map((l) => (
        <LoreMarker
          key={l.id}
          spot={l}
        />
      ))}
    </>
  );
}