"use client";

import { useState, useEffect } from "react";
import type { PermanentSpot, SpotCategory } from "@/lib/types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function cacheKey(category?: SpotCategory): string {
  return `spots_cache_${category ?? "all"}`;
}

interface CacheEntry {
  spots: PermanentSpot[];
  cachedAt: number;
}

function readCache(category?: SpotCategory): PermanentSpot[] | null {
  try {
    const raw = localStorage.getItem(cacheKey(category));
    if (!raw) return null;

    const entry: CacheEntry = JSON.parse(raw);
    const age = Date.now() - entry.cachedAt;

    if (age > CACHE_TTL_MS) {
      localStorage.removeItem(cacheKey(category));
      return null;
    }

    return entry.spots;
  } catch {
    return null;
  }
}

function writeCache(spots: PermanentSpot[], category?: SpotCategory): void {
  try {
    const entry: CacheEntry = { spots, cachedAt: Date.now() };
    localStorage.setItem(cacheKey(category), JSON.stringify(entry));
  } catch {}
}

interface UseSpotsReturn {
  spots: PermanentSpot[];
  isLoading: boolean;
  error: string | null;
}

export function useSpots(category?: SpotCategory): UseSpotsReturn {
  const [spots, setSpots] = useState<PermanentSpot[]>(
    () => readCache(category) ?? [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    () => readCache(category) === null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const cached = readCache(category);
    if (cached !== null) {
      setSpots(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const url = category ? `/api/spots?category=${category}` : "/api/spots";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("fetch_failed");
        return res.json();
      })
      .then((data: { spots: PermanentSpot[] }) => {
        if (cancelled) return;
        const fresh = data.spots ?? [];
        setSpots(fresh);
        writeCache(fresh, category);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Couldn't load spots. Pull down to refresh.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  return { spots, isLoading, error };
}
