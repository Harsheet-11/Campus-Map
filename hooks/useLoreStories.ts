"use client";

import { useQuery } from "@tanstack/react-query";
import type { LoreStory } from "@/lib/types";

async function fetchLoreStories(): Promise<LoreStory[]> {
  const res = await fetch("/api/lore");

  if (!res.ok) {
    throw new Error("Failed to fetch lore stories");
  }

  const data = await res.json();

  return data.stories;
}

export function useLoreStories() {
  return useQuery<LoreStory[]>({
    queryKey: ["lore-stories"],
    queryFn: fetchLoreStories,
    staleTime: 1000 * 60 * 5,
  });
}