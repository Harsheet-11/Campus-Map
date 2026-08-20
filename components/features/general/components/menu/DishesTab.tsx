"use client";

import { useRef, useState } from "react";
import { useCanteenFood } from "@/hooks/useCanteenFood";
import { useUserStore } from "@/stores/userStore";

export default function DishesTab({
  canteenId,
  onLoginRequired,
}: {
  canteenId: string;
  onLoginRequired: () => void;
}) {
  const { data, isLoading, error } = useCanteenFood(canteenId);

  const user = useUserStore((state) => state.user);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  const food = data?.food_items ?? [];

  // user_votes from server — tells us what this user already voted on
  // This is the persisted state from the database
  const userVotes = data?.user_votes ?? {};

  // optimisticVotes is the LOCAL override
  // It reflects what the user just clicked, before the server confirms
  // key: dishId, value: "UP" | null
  const [optimisticVotes, setOptimisticVotes] = useState<
    Record<string, "UP" | null>
  >({});

  // One debounce timer per dish
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <div className="flex gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-amber-100" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-amber-200" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-amber-100" />
        </div>
        <p className="text-[13px] font-bold text-gray-400">Loading dishes...</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6">
        <div className="text-[28px]">😕</div>
        <p
          className="text-center text-[13.5px] font-extrabold text-gray-900"
          style={{ letterSpacing: "-0.01em" }}
        >
          Something went wrong
        </p>
        <p className="text-center text-[12px] font-medium text-gray-400">
          Could not load dishes. Try again later.
        </p>
      </div>
    );
  }

  // ── Empty ──
  if (food.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6">
        <div className="text-[28px]">🍽️</div>
        <p
          className="text-center text-[13.5px] font-extrabold text-gray-900"
          style={{ letterSpacing: "-0.01em" }}
        >
          No dishes yet
        </p>
        <p className="text-center text-[12px] font-medium text-gray-400">
          Be the first to suggest a dish!
        </p>
      </div>
    );
  }

  const handleLike = (dishId: string) => {
    if (!hasHydrated) {
      return;
    }

    if (!user) {
      onLoginRequired();
      return;
    }

    const currentVote =
      optimisticVotes[dishId] !== undefined
        ? optimisticVotes[dishId]
        : userVotes[dishId] === "UP"
          ? "UP"
          : null;

    // Toggle: UP → null, null → UP
    const nextVote: "UP" | null = currentVote === "UP" ? null : "UP";

    // Step 1: Update UI immediately
    setOptimisticVotes((prev) => ({
      ...prev,
      [dishId]: nextVote,
    }));

    // Step 2: Cancel previous pending timer for this dish
    if (timers.current[dishId]) {
      clearTimeout(timers.current[dishId]);
    }

    // Step 3: Debounce — wait 500ms after last click before sending
    timers.current[dishId] = setTimeout(async () => {
      try {
        // This URL matches your actual file:
        // app/(api)/api/food/[item-id]/vote/route.ts
        const res = await fetch(`/api/food/${dishId}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vote_type: nextVote }),
        });

        if (res.status === 401) {
          // Not logged in — revert the optimistic UI
          setOptimisticVotes((prev) => {
            const copy = { ...prev };
            delete copy[dishId];
            return copy;
          });

          // Tell MenuCard to show the login popup
          onLoginRequired();
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to save vote");
        }

        // Success — optimistic UI is already correct
        // Do NOT refetch here — the debounce handles rapid clicks
        // The cache will be refreshed next time the canteen is opened
      } catch (err) {
        console.error("Vote error:", err);

        // Revert optimistic UI on failure
        setOptimisticVotes((prev) => {
          const copy = { ...prev };
          delete copy[dishId];
          return copy;
        });
      }
    }, 500);
  };

  const rankedFood = [...food].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      {/* Header */}
      <div className="flex-shrink-0 pb-4">
        <h2
          className="text-[21px] font-black text-gray-900"
          style={{ letterSpacing: "-0.04em" }}
        >
          Crowd favorites
        </h2>
        <p className="mt-0.5 text-[11px] font-medium text-gray-400">
          The dishes people love most
        </p>
      </div>

      {/* Dishes */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1">
        <div className="space-y-3">
          {rankedFood.map((dish, index) => {
            // isLiked:
            // If user interacted this session → use optimisticVotes
            // If no interaction this session → use server userVotes
            const isLiked =
              optimisticVotes[dish.id] !== undefined
                ? optimisticVotes[dish.id] === "UP"
                : userVotes[dish.id] === "UP";

            // likeCount:
            // Start with server count (dish.upvotes)
            // +1 if user liked locally but server doesn't know yet
            // -1 if user unliked locally but server doesn't know yet
            const likeCount =
              dish.upvotes +
              (optimisticVotes[dish.id] === "UP" && userVotes[dish.id] !== "UP"
                ? 1
                : 0) -
              (optimisticVotes[dish.id] === null && userVotes[dish.id] === "UP"
                ? 1
                : 0);

            return (
              <div
                key={dish.id}
                className={`
                  group relative
                  flex items-center gap-3
                  rounded-[20px] border bg-white p-3
                  transition-all duration-200
                  ${
                    isLiked
                      ? "border-[#FFC4BC] shadow-[0_5px_18px_rgba(239,93,74,0.08)]"
                      : "border-gray-100 shadow-sm hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
                  }
                `}
              >
                {/* Rank badge */}
                <div
                  className={`
                    relative flex h-[46px] w-[46px] flex-shrink-0
                    items-center justify-center rounded-[15px]
                    text-[16px] font-black
                    transition-all duration-200 group-hover:rotate-[-4deg]
                    ${
                      index === 0
                        ? "bg-[#FFE8A8] text-[#9A6A00]"
                        : index === 1
                          ? "bg-[#FFE0D8] text-[#B85D4D]"
                          : index === 2
                            ? "bg-[#DFF1C9] text-[#618C35]"
                            : "bg-[#E1EBFF] text-[#5875B0]"
                    }
                  `}
                >
                  {index + 1}
                </div>

                {/* Dish info */}
                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate text-[14px] font-extrabold text-gray-900"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {dish.dish_name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-[1.4] text-gray-500">
                    {dish.review}
                  </p>
                </div>

                {/* Heart button */}
                <div className="flex flex-shrink-0 flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleLike(dish.id)}
                    aria-pressed={isLiked}
                    aria-label={
                      isLiked
                        ? `Remove ${dish.dish_name} from favorites`
                        : `Love ${dish.dish_name}`
                    }
                    className={`
                      flex h-[42px] w-[42px] items-center justify-center
                      rounded-full transition-all duration-200
                      active:scale-90 focus:outline-none
                      focus-visible:ring-2 focus-visible:ring-[#EF6B5B]
                      focus-visible:ring-offset-2
                      ${
                        isLiked
                          ? "bg-[#FFF0ED] text-[#E85D4A]"
                          : "bg-[#FFF8E9] text-gray-400 hover:scale-105 hover:bg-[#FFF0ED] hover:text-[#E85D4A]"
                      }
                    `}
                  >
                    <span
                      className={`text-[22px] leading-none ${
                        isLiked ? "animate-[heartPop_0.4s_ease-out]" : ""
                      }`}
                    >
                      {isLiked ? "♥" : "♡"}
                    </span>
                  </button>

                  {/* Like count */}
                  <div
                    className={`
                      mt-1 flex items-center gap-1
                      text-[10px] font-bold leading-none
                      transition-colors duration-200
                      ${isLiked ? "text-[#E85D4A]" : "text-gray-400"}
                    `}
                  >
                    <span>{likeCount}</span>
                    <span>{likeCount === 1 ? "like" : "likes"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 pt-3 pb-1 text-center">
        <span className="text-[10px] font-semibold text-gray-400">
          Tap a heart to vote
        </span>
      </div>

      <style jsx>{`
        @keyframes heartPop {
          0% {
            transform: scale(0.65);
          }
          45% {
            transform: scale(1.3);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
