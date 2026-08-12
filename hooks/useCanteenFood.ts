"use client";

import { useQuery } from "@tanstack/react-query";

export type Dish = {
  id: string;
  dish_name: string;
  review: string;
  upvotes: number;
  downvotes: number;
  score: number;
  canteen_id: string;
};

export type CanteenFoodResponse = {
  food_items: Dish[];
  user_votes: Record<string, "UP" | "DOWN">;
};

export async function fetchCanteenFood(
  canteenId: string,
): Promise<CanteenFoodResponse> {
  const res = await fetch(`/api/canteens/${canteenId}/food`);

  if (!res.ok) {
    throw new Error("Failed to fetch canteen food");
  }

  const data: CanteenFoodResponse = await res.json();

  return data;
}

export function useCanteenFood(canteenId: string) {
  return useQuery<CanteenFoodResponse>({
    queryKey: ["canteen-food", canteenId],
    queryFn: () => fetchCanteenFood(canteenId),
    enabled: !!canteenId,
  });
}