"use client";

import { useState, useMemo } from "react";

import type { PermanentSpot } from "@/lib/types";
import MenuHeader from "./MenuHeader";
import DishesTab from "./DishesTab";
import SuggestTab from "./SuggestTab";

type Dish = {
  id: string;
  dish_name: string;
  review: string;
  upvotes: number;
  downvotes: number;
};

export default function MenuCard({
  spot,
  onClose,
}: {
  spot: PermanentSpot;
  onClose?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"dishes" | "suggest">("dishes");
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});

  const [dishes] = useState<Dish[]>([
    {
      id: "1",
      dish_name: "Cheesy Burger",
      review: "Juicy grilled patty with cheese, lettuce & special sauce.",
      upvotes: 124,
      downvotes: 8,
    },
    {
      id: "2",
      dish_name: "Masala Fries",
      review: "Crispy fries tossed in peri peri masala.",
      upvotes: 98,
      downvotes: 6,
    },
    {
      id: "3",
      dish_name: "Cold Coffee",
      review: "Smooth cold coffee with a perfect blend.",
      upvotes: 76,
      downvotes: 4,
    },
    {
      id: "4",
      dish_name: "Creamy Pasta",
      review: "Creamy white sauce pasta with herbs & veggies.",
      upvotes: 61,
      downvotes: 5,
    },
    {
      id: "5",
      dish_name: "Chicken Wings",
      review: "Spicy grilled wings tossed in tangy sauce.",
      upvotes: 54,
      downvotes: 3,
    },
    {
      id: "6",
      dish_name: "Veggie Wrap",
      review: "Fresh veggies wrapped in soft tortilla with sauce.",
      upvotes: 42,
      downvotes: 2,
    },
    {
      id: "7",
      dish_name: "Chocolate Shake",
      review: "Rich chocolate shake topped with whipped cream.",
      upvotes: 38,
      downvotes: 1,
    },
  ]);

  const handleVote = (dishId: string) => {
    setUserVotes((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  const getVoteCount = (dish: Dish) => {
    return dish.upvotes + (userVotes[dish.id] ? 1 : 0);
  };

  const sortedDishes = useMemo(() => {
    return [...dishes].sort((a, b) => getVoteCount(b) - getVoteCount(a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishes, userVotes]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-[28px] shadow-2xl overflow-hidden w-full max-w-[360px] h-[90vh] max-h-[640px] flex flex-col font-sans"
      >
        {/* ============ HEADER ============ */}
        <MenuHeader spot={spot} onClose={onClose} />

        {/* ============ TABS ============ */}
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

        {/* ============ CONTENT ============ */}
        <div className="flex-1 min-h-0 flex flex-col px-4 pb-4">
          {activeTab === "dishes" && (
            <DishesTab
              sortedDishes={sortedDishes}
              userVotes={userVotes}
              getVoteCount={getVoteCount}
              handleVote={handleVote}
            />
          )}

          {activeTab === "suggest" && (
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <SuggestTab />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}