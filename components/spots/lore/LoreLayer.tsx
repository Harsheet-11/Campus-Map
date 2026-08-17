"use client";

import { useMapStore } from "@/components/stores/mapStore";
import { useLoreStories } from "@/hooks/useLoreStories";
import LoreMarker from "@/components/spots/lore/LoreMarker";

export default function LoreLayer() {
  const mode = useMapStore((s) => s.mode);
  const { data: stories = [] } = useLoreStories();

  if (mode !== "lore") return null;

  return (
    <>
      {stories.map((story) => (
        <LoreMarker
          key={story.id}
          story={story}
        />
      ))}
    </>
  );
}