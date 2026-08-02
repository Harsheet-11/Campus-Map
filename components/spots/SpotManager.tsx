"use client";

import { useSpots } from "@/hooks/useSpots";
import SpotMarker from "@/components/spots/SpotMarker";
import { useMapStore } from "@/components/stores/mapStore";

export default function SpotManager() {
  const { data: spots = [], isLoading } = useSpots();
  const zoom = useMapStore((state) => state.zoom)
  const visibleSpots = spots.filter((spot) => zoom>= spot.min_zoom)

  if (isLoading) return null;

  return (
    <>
      {visibleSpots.map((spot) => (
        <SpotMarker key={spot.id} spot={spot} />
      ))}
    </>
  );
}
