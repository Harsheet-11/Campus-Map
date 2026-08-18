"use client";

import { useQuery } from "@tanstack/react-query";
import type { LoreSpot } from "@/lib/types";

async function fetchLoreStories(): Promise<LoreSpot[]> {
  const res = await fetch("/api/lore");

  if (!res.ok) {
    throw new Error("Failed to fetch lore stories");
  }

  const data = await res.json();

  return data.lore;
}

export function useLore() {
  return useQuery<LoreSpot[]>({
    queryKey: ["lore-stories"],
    queryFn: fetchLoreStories,
    staleTime: 1000 * 60 * 5,
  });
}