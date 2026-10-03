import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ "item-id": string }> },
) {
  const supabase = await createClient();
  const { "item-id": foodItemId } = await params;

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  // Validate request body
  let body: { vote_type?: "UP" | "DOWN" };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  if (body.vote_type !== "UP" && body.vote_type !== "DOWN") {
    return NextResponse.json(
      { error: "vote_type must be UP or DOWN" },
      { status: 400 },
    );
  }

  // Find food item + canteen for cache invalidation
  const { data: foodItem, error: foodItemError } = await supabase
    .from("food_items")
    .select("id, canteen_id")
    .eq("id", foodItemId)
    .single();

  if (foodItemError || !foodItem) {
    return NextResponse.json(
      { error: "Food item not found" },
      { status: 404 },
    );
  }

  // Create/update user's vote
  const { data: vote, error: voteError } = await supabase
    .from("food_votes")
    .upsert(
      {
        food_item_id: foodItemId,
        user_id: user.id,
        vote_type: body.vote_type,
      },
      {
        onConflict: "food_item_id,user_id",
      },
    )
    .select("food_item_id, vote_type")
    .single();

  if (voteError) {
    console.error("FOOD VOTE ERROR:", voteError);

    return NextResponse.json(
      { error: "Could not save vote" },
      { status: 500 },
    );
  }

  // Invalidate the public CDN-cached food list.
  revalidatePath(`/api/canteens/${foodItem.canteen_id}/food`);

  return NextResponse.json(
    {
      success: true,
      vote,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ "item-id": string }> },
) {
  const supabase = await createClient();
  const { "item-id": foodItemId } = await params;

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  // Find food item + canteen
  const { data: foodItem, error: foodItemError } = await supabase
    .from("food_items")
    .select("id, canteen_id")
    .eq("id", foodItemId)
    .single();

  if (foodItemError || !foodItem) {
    return NextResponse.json(
      { error: "Food item not found" },
      { status: 404 },
    );
  }

  // Remove user's vote
  const { error: deleteError } = await supabase
    .from("food_votes")
    .delete()
    .eq("food_item_id", foodItemId)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("FOOD VOTE DELETE ERROR:", deleteError);

    return NextResponse.json(
      { error: "Could not remove vote" },
      { status: 500 },
    );
  }

  // Invalidate public food cache
  revalidatePath(`/api/canteens/${foodItem.canteen_id}/food`);

  return NextResponse.json(
    {
      success: true,
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
