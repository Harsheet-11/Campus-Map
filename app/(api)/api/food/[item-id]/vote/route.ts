import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ "item-id": string }> }
) {
  const supabase = await createClient();

  // Get the food item ID from the URL
  const { "item-id": itemId } = await params;

  // Get the logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      {
        error: "You must be logged in to vote",
      },
      { status: 401 }
    );
  }

  // Get the vote from the request
  const body = await request.json();

  const { vote_type } = body;

  if (!vote_type) {
    return NextResponse.json(
      {
        error: "vote_type is required",
      },
      { status: 400 }
    );
  }

  // Get the food item
  const { data: foodItem, error: foodError } = await supabase
    .from("food_items")
    .select("id, upvotes, downvotes")
    .eq("id", itemId)
    .single();

  if (foodError || !foodItem) {
    return NextResponse.json(
      {
        error: "Food item not found",
      },
      { status: 404 }
    );
  }

  // Calculate the new vote count
  let upvotes = foodItem.upvotes;
  let downvotes = foodItem.downvotes;

  if (vote_type === "UP") {
    upvotes = upvotes + 1;
  }

  if (vote_type === "DOWN") {
    downvotes = downvotes + 1;
  }

  // Update the food item
  const { data, error } = await supabase
    .from("food_items")
    .update({
      upvotes,
      downvotes,
    })
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    console.error("VOTE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        error: "Could not update vote",
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "Vote recorded successfully",
    item: data,
  });
}