import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: canteenId } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No logged-in user.
  if (!user) {
    return NextResponse.json(
      { user_votes: {} },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  }

  const { data: foodItems, error: foodItemsError } = await supabase
    .from("food_items")
    .select("id")
    .eq("canteen_id", canteenId)
    .eq("approved", true);

  if (foodItemsError) {
    console.error("FOOD ITEMS GET ERROR:", foodItemsError);

    return NextResponse.json(
      { error: "Could not fetch food items" },
      { status: 500 },
    );
  }

  const foodItemIds = foodItems?.map((item) => item.id) ?? [];

  if (foodItemIds.length === 0) {
    return NextResponse.json(
      { user_votes: {} },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  }

  const { data: votes, error: votesError } = await supabase
    .from("food_votes")
    .select("food_item_id, vote_type")
    .eq("user_id", user.id)
    .in("food_item_id", foodItemIds);

  if (votesError) {
    console.error("USER VOTES GET ERROR:", votesError);

    return NextResponse.json(
      { error: "Could not fetch user votes" },
      { status: 500 },
    );
  }

  const userVotes = Object.fromEntries(
    (votes ?? []).map((vote) => [
      vote.food_item_id,
      vote.vote_type,
    ]),
  ) as Record<string, "UP" | "DOWN">;

  return NextResponse.json(
    {
      user_votes: userVotes,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
