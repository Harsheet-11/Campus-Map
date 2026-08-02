import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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
    return NextResponse.json(
      {
        error: "Could not load spots",
      },
      {
        status: 500,
      },
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
    icon: Array.isArray(row.icons)
      ? (row.icons[0] ?? null)
      : (row.icons ?? null),
  }));

  return NextResponse.json({
    spots,
  });
}
