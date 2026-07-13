import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");

  if (!name) {
    return NextResponse.json({ available: false });
  }

  const supabase = createServiceClient();

  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("npc_name", name)
    .single();

  // If data is null, no one has that name — it's available
  return NextResponse.json({ available: !data });
}