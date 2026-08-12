import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: canteenId } = await params;

  // Fetch approved food items for this canteen
  const { data: foodItems, error: foodError } = await supabase
    .from("food_items")
    .select("id, dish_name, review, upvotes, downvotes, score, canteen_id")
    .eq("canteen_id", canteenId)
    .eq("approved", true)
    .order("score", { ascending: false });

  if (foodError) {
    console.error("SUPABASE GET ERROR:", foodError);
    return NextResponse.json(
      { error: "Could not fetch food items", details: foodError.message },
      { status: 500 },
    );
  }

  // Check if user is logged in
  // If not logged in, we still return food items but with empty votes
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is logged in, fetch their votes for these specific dishes
  let userVotes: Record<string, "UP" | "DOWN"> = {};

  if (user && foodItems && foodItems.length > 0) {
    const foodItemIds = foodItems.map((item) => item.id);

    const { data: votes, error: votesError } = await supabase
      .from("food_votes")
      .select("food_item_id, vote_type")
      .eq("user_id", user.id)
      .in("food_item_id", foodItemIds);

    if (!votesError && votes) {
      // Convert array to a map for easy lookup
      // { "dish-uuid": "UP", "dish-uuid-2": "UP" }
      userVotes = Object.fromEntries(
        votes.map((v) => [v.food_item_id, v.vote_type]),
      ) as Record<string, "UP" | "DOWN">;
    }
  }

  return NextResponse.json({
    food_items: foodItems ?? [],
    // user_votes tells the frontend which dishes this user has already liked
    user_votes: userVotes,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: canteenId } = await params;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { error: "You must be logged in to submit a food item" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { dish_name, suggestion } = body;

  if (!dish_name || !suggestion) {
    return NextResponse.json(
      { error: "dish_name and suggestion are required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("food_submissions")
    .insert({
      canteen_id: canteenId,
      dish_name,
      suggestion,
      submitted_by: user.id,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("SUPABASE POST ERROR:", error);
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Food suggestion submitted successfully", submission: data },
    { status: 201 },
  );
}