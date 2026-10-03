import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cachedResponse } from "@/lib/cache-response";
import { checkRateLimit } from "@/lib/redis/rate-limit";

export async function GET(request: Request) {
  // 1. Get user's IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  // 2. Check rate limit
  const { success, headers: rateLimitHeaders } = await checkRateLimit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: rateLimitHeaders,
      },
    );
  }

  // 3. Get data from Supabase
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lore_stories")
    .select(
      "id, title, content, lat, lng, is_canon, chill_count, icon, location_hint",
    )
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("SUPABASE GET ERROR:", error);

    return NextResponse.json(
      { error: "Could not load lore stories" },
      {
        status: 500,
        headers: rateLimitHeaders,
      },
    );
  }

  // 4. Format the data
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

  // 5. Add CDN cache headers
  const response = cachedResponse({ lore }, "lore");

  // 6. Preserve rate-limit headers
  Object.entries(rateLimitHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
