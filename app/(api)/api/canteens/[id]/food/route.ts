import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import redis from "@/lib/redis/redis";
import type { FoodItem } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const supabase = await createClient();
  const { id: canteenId } = await params;

  const cacheKey = `food:canteen:${canteenId}`;

  // 1. Try Redis for food items (not user_votes — those are always live)
  let foodItems: FoodItem[] | null = null;

  try {
    const cached = await redis.get<FoodItem[]>(cacheKey);
    if (cached) {
      console.log("REDIS HIT", cacheKey);
      foodItems = cached;
    } else {
      console.log("REDIS MISS", cacheKey);
    }
  } catch (err) {
    console.error("Redis read error:", err);
  }

  // 2. If no cache, fetch from Supabase
  if (!foodItems) {
    const { data, error } = await supabase
      .from("food_items")
      .select("id, dish_name, review, upvotes, downvotes, score, canteen_id")
      .eq("canteen_id", canteenId)
      .eq("approved", true)
      .order("score", { ascending: false });

    if (error) {
      console.error("SUPABASE GET ERROR:", error);
      return NextResponse.json(
        { error: "Could not fetch food items", details: error.message },
        { status: 500 },
      );
    }

    foodItems = data ?? [];

    // 3. Save to Redis
    try {
      await redis.set(cacheKey, foodItems, { ex: 60 });
      console.log("SAVED TO REDIS", cacheKey);
    } catch (err) {
      console.error("Redis write error:", err);
    }
  }

  // 4. user_votes is always fetched live — never cached
  const { data: { user } } = await supabase.auth.getUser();
  let userVotes: Record<string, "UP" | "DOWN"> = {};

  if (user && foodItems && foodItems.length > 0) {
    const foodItemIds = foodItems.map((item) => item.id);

    const { data: votes, error: votesError } = await supabase
      .from("food_votes")
      .select("food_item_id, vote_type")
      .eq("user_id", user.id)
      .in("food_item_id", foodItemIds);

    if (!votesError && votes) {
      userVotes = Object.fromEntries(
        votes.map((v) => [v.food_item_id, v.vote_type]),
      ) as Record<string, "UP" | "DOWN">;
    }
  }

  return NextResponse.json({
    food_items: foodItems,
    user_votes: userVotes,
  });
}