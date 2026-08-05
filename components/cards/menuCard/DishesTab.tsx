"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, SparklesIcon } from "@hugeicons/core-free-icons";

type Dish = {
  id: string;
  dish_name: string;
  review: string;
  upvotes: number;
  downvotes: number;
};

export default function DishesTab({
  sortedDishes,
  userVotes,
  getVoteCount,
  handleVote,
}: {
  sortedDishes: Dish[];
  userVotes: Record<string, boolean>;
  getVoteCount: (dish: Dish) => number;
  handleVote: (dishId: string) => void;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0 font-sans">
      {/* Scrollable dishes list */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2.5 pr-1 -mr-1">
        {sortedDishes.map((dish, index) => {
          const voted = userVotes[dish.id];
          const count = getVoteCount(dish);

          return (
            <div
              key={dish.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_6px_-2px_rgba(0,0,0,0.06)] p-3 flex items-center gap-3"
            >
              {/* Rank number thumbnail */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center">
                <span
                  className="text-[22px] font-extrabold text-amber-700"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  #{index + 1}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-extrabold text-[15px] text-gray-900 leading-tight"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {dish.dish_name}
                </h3>
                <p
                  className="text-[12px] text-gray-500 mt-0.5 leading-snug font-medium line-clamp-2"
                  style={{ letterSpacing: "-0.003em" }}
                >
                  {dish.review}
                </p>
              </div>

              {/* Vote button */}
              <button
                onClick={() => handleVote(dish.id)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-11 h-13 rounded-xl px-2 py-1.5 transition-all ${
                  voted
                    ? "bg-[#FFCC33] text-gray-900 shadow-md"
                    : "bg-[#FFF3C4] text-gray-800 hover:bg-[#FFE894]"
                }`}
                aria-label="Upvote"
              >
                <HugeiconsIcon
                  icon={ArrowUp01Icon}
                  size={14}
                  strokeWidth={3}
                />
                <span className="font-extrabold text-[13px] mt-0.5 tabular-nums leading-none">
                  {count}
                </span>
              </button>
            </div>
          );
        })}

        {sortedDishes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm font-bold text-gray-800">No dishes yet</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Be the first to suggest one!
            </p>
          </div>
        )}
      </div>

      {/* Fixed footer note */}
      <div className="flex-shrink-0 pt-3 pb-1 flex items-center justify-center gap-1.5 text-[11px] text-gray-400 font-semibold border-t border-gray-50 mt-2">
        <HugeiconsIcon icon={SparklesIcon} size={11} />
        <span>Voting helps us know what you love!</span>
      </div>
    </div>
  );
}