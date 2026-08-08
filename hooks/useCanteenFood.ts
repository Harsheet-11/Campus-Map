"use client";

import { useQuery } from "@tanstack/react-query";

export type Dish = {
  id: string;
  dish_name: string;
  review: string;
  upvotes: number;
  downvotes: number;
  score: number;
};

type CanteenFoodResponse = {
  food_items: Dish[];
};

export async function fetchCanteenFood(canteenId: string): Promise<Dish[]> {
  const res = await fetch(`/api/canteens/${canteenId}/food`);

  if (!res.ok) {
    throw new Error("Failed to fetch canteen food");
  }

  const data: CanteenFoodResponse = await res.json();
  return data.food_items;
}

export function useCanteenFood(canteenId: string) {
  return useQuery<Dish[]>({
    queryKey: ["canteen-food", canteenId],
    queryFn: () => fetchCanteenFood(canteenId),
    enabled: !!canteenId,
  });
}
