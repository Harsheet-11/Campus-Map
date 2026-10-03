import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cachedResponse } from "@/lib/cache-response";
import type { FoodItem } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: canteenId } = await params;

  const { data, error } = await supabase
    .from("food_items")
    .select(
      "id, dish_name, review, upvotes, downvotes, score, canteen_id",
    )
    .eq("canteen_id", canteenId)
    .eq("approved", true)
    .order("score", { ascending: false });

  if (error) {
    console.error("SUPABASE GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not fetch food items",
        details: error.message,
      },
      { status: 500 },
    );
  }

  const foodItems: FoodItem[] = data ?? [];

  return cachedResponse(
    {
      food_items: foodItems,
    },
    "food",
  );
}
