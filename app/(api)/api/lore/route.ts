// Gets all approved stories for displaying map markersimport { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lore_stories")
    .select("id, title, content, lat, lng, is_canon, chill_count, icon")
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
  }));

  return NextResponse.json({ lore });
}