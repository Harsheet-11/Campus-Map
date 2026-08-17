"use client";

import { useSpots } from "@/hooks/useSpots";
import { useLoreStories } from "@/hooks/useLoreStories";
import SpotMarker from "@/components/spots/general/SpotMarker";
import LoreMarker from "@/components/spots/lore/LoreMarker";
import { useMapStore } from "@/components/stores/mapStore";

export default function SpotManager() {
  const { data: spots = [], isLoading: spotsLoading } = useSpots();
  const { data: loreStories = [], isLoading: loreLoading } = useLoreStories();

  const zoom = useMapStore((state) => state.zoom);
  const mode = useMapStore((state) => state.mode);

  if (spotsLoading || loreLoading) return null;

  const visibleSpots = spots.filter(
    (spot) =>
      spot.mode === mode &&
      zoom >= spot.min_zoom
  );

  return (
    <>
      {visibleSpots.map((spot) => (
        <SpotMarker
          key={spot.id}
          spot={spot}
        />
      ))}

      {mode === "lore" &&
        loreStories.map((story) => (
          <LoreMarker
            key={story.id}
            story={story}
          />
        ))}
    </>
  );
}