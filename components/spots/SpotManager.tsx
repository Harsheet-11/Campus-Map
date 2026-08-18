"use client";

import { useSpots } from "@/hooks/useSpots";
import { useLore } from "@/hooks/useLoreStories";
import SpotMarker from "@/components/spots/general/SpotMarker";
import LoreMarker from "@/components/spots/lore/LoreMarker";
import { useMapStore } from "@/stores/mapStore";

export default function SpotManager() {
  const { data: spots = [], isLoading: spotsLoading } = useSpots();
  const { data: lore = [], isLoading: loreLoading } = useLore();

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
      {mode !== "lore" &&
        visibleSpots.map((spot) => (
          <SpotMarker
            key={spot.id}
            spot={spot}
          />
        ))}

      {/* Lore markers */}
      {mode === "lore" &&
        lore.map((story) => (
          <LoreMarker
            key={story.id}
            spot={story}
          />
        ))}
    </>
  );
}
