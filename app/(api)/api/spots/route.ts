import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  const supabase = await createClient();

  let query = supabase
    .from("permanent_spots")
    .select(
      `
      id,
      name,
      category,
      lat,
      lng,
      description,
      min_zoom,
      icons!inner (
        emoji,
        slug,
        color
      )
    `,
    )
    .eq("approved", true)
    .eq("is_hidden", false);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: { code: "DB_ERROR", message: "Could not load spots." } },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

  const spots = (data ?? []).map((row) => {
    const icon = Array.isArray(row.icons) ? row.icons[0] : row.icons;
    const showLabel = row.category !== "CHAI";

    return {
      id: row.id,
      name: row.name,
      category: row.category,
      lat: Number(row.lat),
      lng: Number(row.lng),
      description: row.description,
      min_zoom: row.min_zoom,
      icon: {
        emoji: icon.emoji,
        slug: icon.slug,
        color: icon.color,
        show_name_label: showLabel,
        name_label_min_zoom: showLabel ? (row.min_zoom ?? null) : null,
      },
    };
  });

  return NextResponse.json(
    { spots },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" } },
  );
}
