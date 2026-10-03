"use client";

import { useSpots } from "@/hooks/useSpots";
import SpotMarker from "@/components/features/general/GeneralMarker";
import { useMapStore } from "@/stores/mapStore";

export default function SpotManager() {
  const { data: spots = [], isLoading } = useSpots();

  const zoom = useMapStore((state) => state.zoom);
  const mode = useMapStore((state) => state.mode);

  if (isLoading) return null;

  const visibleSpots = spots.filter(
    (spot) =>
      spot.mode === mode &&
      zoom >= spot.min_zoom
  );

  if (mode === "lore") return null;

  return (
    <>
      {visibleSpots.map((spot) => (
        <SpotMarker
          key={spot.id}
          spot={spot}
        />
      ))}
    </>
  );
}
