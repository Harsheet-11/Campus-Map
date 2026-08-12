import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ "item-id": string }>;
  },
) {
  const supabase = await createClient();

  const { "item-id": foodItemId } = await params;

  // 1. Check login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please log in to vote" },
      { status: 401 },
    );
  }

  // 2. Get requested final state
  const body = await request.json();

  const voteType = body.vote_type;

  if (voteType !== "UP" && voteType !== null) {
    return NextResponse.json(
      { error: "Invalid vote_type" },
      { status: 400 },
    );
  }

  // 3. Make sure food item exists
  const { data: foodItem, error: foodError } = await supabase
    .from("food_items")
    .select("id")
    .eq("id", foodItemId)
    .single();

  if (foodError || !foodItem) {
    return NextResponse.json(
      { error: "Food item not found" },
      { status: 404 },
    );
  }

  // 4. User wants to remove their vote
  if (voteType === null) {
    const { error } = await supabase
      .from("food_votes")
      .delete()
      .eq("user_id", user.id)
      .eq("food_item_id", foodItemId);

    if (error) {
      console.error("DELETE VOTE ERROR:", error);

      return NextResponse.json(
        { error: "Could not remove vote" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      vote_type: null,
    });
  }

  // 5. User wants UP
  const { error } = await supabase
    .from("food_votes")
    .upsert(
      {
        user_id: user.id,
        food_item_id: foodItemId,
        vote_type: "UP",
      },
      {
        onConflict: "user_id,food_item_id",
      },
    );

  if (error) {
    console.error("UPSERT VOTE ERROR:", error);

    return NextResponse.json(
      { error: "Could not save vote" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    vote_type: "UP",
  });
}