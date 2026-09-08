import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import redis from "@/lib/redis/redis";

const CACHE_KEY = "lore:all";

export async function GET() {
  // 1. Try Redis
  try {
    const cached = await redis.get<{ lore: unknown[] }>(CACHE_KEY);
    if (cached) {
      console.log("REDIS HIT", CACHE_KEY);
      return NextResponse.json(cached, { headers: { "X-Cache": "HIT" } });
    }
    console.log("REDIS MISS", CACHE_KEY);
  } catch (err) {
    console.error("Redis read error:", err);
  }

  // 2. Fetch from Supabase
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lore_stories")
    .select("id, title, content, lat, lng, is_canon, chill_count, icon, location_hint")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "Could not load lore stories" },
      { status: 500 },
    );
  }

  const lore = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    lat: Number(row.lat),
    lng: Number(row.lng),
    is_canon: row.is_canon,
    chill_count: row.chill_count,
    icon: row.icon,
    location: row.location_hint,
  }));

  const response = { lore };

  // 3. Save to Redis
  try {
    await redis.set(CACHE_KEY, response, { ex: 300 });
    console.log("SAVED TO REDIS", CACHE_KEY);
  } catch (err) {
    console.error("Redis write error:", err);
  }

  return NextResponse.json(response, { headers: { "X-Cache": "MISS" } });
}