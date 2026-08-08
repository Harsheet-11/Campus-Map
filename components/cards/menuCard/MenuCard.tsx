"use client";

import { useState, useMemo, useEffect } from "react";
import type { PermanentSpot } from "@/lib/types";
import MenuHeader from "./MenuHeader";
import DishesTab from "./DishesTab";
import SuggestTab from "./SuggestTab";
import { useCanteenFood } from "@/hooks/useCanteenFood";

export default function MenuCard({
  spot,
  onClose,
}: {
  spot: PermanentSpot;
  onClose?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"dishes" | "suggest">("dishes");

  const {
    data: dishes = [],
    isLoading,
    error,
  } = useCanteenFood(spot.id);

  // Reset to dishes tab whenever a new canteen is opened
  useEffect(() => {
    setActiveTab("dishes");
  }, [spot.id]);

  const sortedDishes = useMemo(() => {
    return [...dishes].sort((a, b) => b.upvotes - a.upvotes);
  }, [dishes]);

  // No more fixed inset-0 backdrop wrapper
  // MenuCard is now just the card itself
  // SpotDialog + DialogContent handle the overlay and centering
  return (
    <div className="relative bg-white rounded-[28px] shadow-2xl overflow-hidden w-full h-full flex flex-col font-sans">

      {/* HEADER */}
      <MenuHeader spot={spot} onClose={onClose} />

      {/* TABS */}
      <div className="flex-shrink-0 px-4 pt-1 pb-3">
        <div className="flex gap-2 bg-gray-50 rounded-full p-1">
          <button
            onClick={() => setActiveTab("dishes")}
            className={`flex-1 py-2 text-[13px] font-extrabold rounded-full transition-all ${
              activeTab === "dishes"
                ? "bg-[#FFCC33] text-gray-900 shadow-sm"
                : "bg-transparent text-gray-500"
            }`}
            style={{ letterSpacing: "-0.005em" }}
          >
            Top Dishes
          </button>
          <button
            onClick={() => setActiveTab("suggest")}
            className={`flex-1 py-2 text-[13px] font-extrabold rounded-full transition-all ${
              activeTab === "suggest"
                ? "bg-[#FFCC33] text-gray-900 shadow-sm"
                : "bg-transparent text-gray-500"
            }`}
            style={{ letterSpacing: "-0.005em" }}
          >
            Suggest a Dish
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-h-0 flex flex-col px-4 pb-4">
        {activeTab === "dishes" && (
          <DishesTab
            key={spot.id}
            sortedDishes={sortedDishes}
            isLoading={isLoading}
            error={error}
          />
        )}

        {activeTab === "suggest" && (
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <SuggestTab canteenId={spot.id} />
          </div>
        )}
      </div>
    </div>
  );
}