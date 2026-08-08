"use client";

import type { Dish } from "@/hooks/useCanteenFood";

type DishesTabProps = {
  sortedDishes: Dish[];
  isLoading: boolean;
  error: Error | null;
};

export default function DishesTab({
  sortedDishes,
  isLoading,
  error,
}: DishesTabProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        {/* Animated pulsing plates */}
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-amber-200 animate-pulse delay-150" />
          <div className="w-8 h-8 rounded-full bg-amber-100 animate-pulse delay-300" />
        </div>
        <p
          className="text-[13px] font-bold text-gray-400"
          style={{ letterSpacing: "-0.005em" }}
        >
          Loading dishes...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6">
        <div className="text-[28px]">😕</div>
        <p
          className="text-[13.5px] font-extrabold text-gray-900 text-center"
          style={{ letterSpacing: "-0.01em" }}
        >
          Something went wrong
        </p>
        <p
          className="text-[12px] font-medium text-gray-400 text-center"
          style={{ letterSpacing: "-0.003em" }}
        >
          Could not load dishes. Try again later.
        </p>
      </div>
    );
  }

  if (sortedDishes.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-6">
        <div className="text-[28px]">🍽️</div>
        <p
          className="text-[13.5px] font-extrabold text-gray-900 text-center"
          style={{ letterSpacing: "-0.01em" }}
        >
          No dishes yet
        </p>
        <p
          className="text-[12px] font-medium text-gray-400 text-center"
          style={{ letterSpacing: "-0.003em" }}
        >
          Be the first to suggest a dish!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain space-y-2 pr-0.5">
      {sortedDishes.map((dish, index) => {
        // Top 3 dishes get a medal
        const medal =
          index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

        // Top dish gets a highlighted card
        const isTop = index === 0;

        return (
          <div
            key={dish.id}
            className={`relative flex items-start gap-3 rounded-2xl px-3.5 py-3 transition-all ${
              isTop
                ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/80 shadow-sm"
                : "bg-gray-50 border border-gray-100 hover:border-gray-200"
            }`}
          >
            {/* Rank badge */}
            <div
              className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl text-[13px] font-extrabold ${
                medal
                  ? isTop
                    ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-500"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {medal ?? index + 1}
            </div>

            {/* Dish info */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5">
                <p
                  className={`text-[13.5px] font-extrabold leading-snug truncate ${
                    isTop ? "text-amber-900" : "text-gray-900"
                  }`}
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {dish.dish_name}
                </p>
                {isTop && (
                  <span className="flex-shrink-0 text-[9px] font-extrabold uppercase tracking-wide text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>

              <p
                className="text-[11.5px] text-gray-500 font-medium mt-0.5 line-clamp-2 leading-snug"
                style={{ letterSpacing: "-0.003em" }}
              >
                {dish.review}
              </p>

              {/* Upvote count as a subtle badge */}
              <div className="flex items-center gap-1 mt-1.5">
                <span className="text-[11px]">👍</span>
                <span
                  className={`text-[11px] font-bold ${
                    isTop ? "text-amber-700" : "text-gray-400"
                  }`}
                >
                  {dish.upvotes}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}