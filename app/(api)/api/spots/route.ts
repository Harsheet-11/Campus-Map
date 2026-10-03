import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cachedResponse } from "@/lib/cache-response";
import { checkRateLimit } from "@/lib/redis/rate-limit";

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("permanent_spots")
    .select(
      `
        id,
        name,
        slang,
        category,
        lat,
        lng,
        min_zoom,
        description,
        display_type,
        click_action,
        mode,
        icons!permanent_spots_icon_id_fkey(
          emoji,
          slug,
          color,
          is_active
        )
      `,
    )
    .eq("approved", true)
    .eq("is_hidden", false)
    .eq("icons.is_active", true);

  if (error) {
    console.error("SUPABASE GET ERROR:", error);

    return NextResponse.json(
      { error: "Could not load spots" },
      { status: 500, headers: rateLimitHeaders },
    );
  }

  const spots = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slang: row.slang,
    category: row.category,
    lat: Number(row.lat),
    lng: Number(row.lng),
    min_zoom: Number(row.min_zoom),
    description: row.description,
    display_type: row.display_type,
    click_action: row.click_action,
    mode: row.mode,
    icon: Array.isArray(row.icons)
      ? (row.icons[0] ?? null)
      : (row.icons ?? null),
  }));

  const response = cachedResponse({ spots }, "spots");

  // 6. Add rate-limit headers
  Object.entries(rateLimitHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
