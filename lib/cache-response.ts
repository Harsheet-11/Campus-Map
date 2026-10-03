
import { NextResponse } from "next/server";

const CACHE_PROFILES = {
  spots: { sMaxAge: 300, staleWhileRevalidate: 600 },

  lore: { sMaxAge: 900, staleWhileRevalidate: 1800 },

  food: { sMaxAge: 180, staleWhileRevalidate: 360 },

  user: { sMaxAge: 30, staleWhileRevalidate: 60 },
} as const;

export function cachedResponse<T>(
  data: T,
  profile: keyof typeof CACHE_PROFILES,
  status: number = 200
) {
  const config = CACHE_PROFILES[profile];

  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": `public, s-maxage=${config.sMaxAge}, stale-while-revalidate=${config.staleWhileRevalidate}`,
      "CDN-Cache-Control": `max-age=${config.sMaxAge}`,
      "Vercel-CDN-Cache-Control": `max-age=${config.sMaxAge}`,
    },
  });
}