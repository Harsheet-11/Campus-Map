import { useQuery } from "@tanstack/react-query";
import type { PermanentSpot } from "@/lib/types";

export async function fetchSpots(): Promise<PermanentSpot[]> {
  const res = await fetch("/api/spots");

  if (!res.ok) {
    throw new Error("Failed to fetch spots");
  }

  const data = await res.json();

  return data.spots;
}

export function useSpots() {
  return useQuery<PermanentSpot[]>({
    queryKey: ["spots"],
    queryFn: fetchSpots,
  });
}
