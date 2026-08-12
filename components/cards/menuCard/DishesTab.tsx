"use client";

import { useRef, useState } from "react";
import { useCanteenFood } from "@/hooks/useCanteenFood";

export default function DishesTab({ canteenId }: { canteenId: string }) {

  const { data, isLoading, error } = useCanteenFood(canteenId);

  const food = data?.food_items ?? [];
  const userVotes = data?.user_votes ?? {};

  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const [optimisticVotes, setOptimisticVotes] = useState<
    Record<string, "UP" | null>
  >({});

  if (isLoading) {
    return <p>Loading Food...</p>;
  }

  if (error) {
    return <p>Failed to Load Food</p>;
  }

  const handleLike = (dishId: string) => {
    const currentVote =
      optimisticVotes[dishId] ?? (userVotes[dishId] === "UP" ? "UP" : null);

    const nextVote = currentVote === "UP" ? null : "UP";

    // 1. CHANGE UI IMMEDIATELY
    setOptimisticVotes((prev) => ({
      ...prev,
      [dishId]: nextVote,
    }));

    // 2. Cancel previous timer
    if (timers.current[dishId]) {
      clearTimeout(timers.current[dishId]);
    }

    // 3. Start/restart timer
    timers.current[dishId] = setTimeout(async () => {
      try {
        const res = await fetch(`/api/food/${dishId}/vote`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vote_type: nextVote,
          }),
        });

        if (res.status === 401) {
          // Revert to database state
          setOptimisticVotes((prev) => {
            const copy = { ...prev };
            delete copy[dishId];
            return copy;
          });

          alert("Please log in to vote");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to save vote");
        }

        // IMPORTANT:
        // Do NOT invalidate/refetch here.

        // The optimistic UI is already showing the final state.
        // Keep it until the next normal food fetch.
      } catch (error) {
        console.error("Vote error:", error);

        // Revert if database save failed
        setOptimisticVotes((prev) => {
          const copy = { ...prev };
          delete copy[dishId];
          return copy;
        });

        alert("Could not save your vote");
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
            const isLiked =
              optimisticVotes[dish.id] !== undefined
                ? optimisticVotes[dish.id] === "UP"
                : userVotes[dish.id] === "UP";

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
                  group
                  relative
                  flex items-center gap-3
                  rounded-[20px]
                  border
                  bg-white
                  p-3
                  transition-all duration-200
                  ${
                    isLiked
                      ? "border-[#FFC4BC] shadow-[0_5px_18px_rgba(239,93,74,0.08)]"
                      : "border-gray-100 shadow-sm hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
                  }
                `}
              >
                {/* Rank */}
                <div
                  className={`
                    relative
                    flex h-[46px] w-[46px]
                    flex-shrink-0
                    items-center justify-center
                    rounded-[15px]
                    text-[16px]
                    font-black
                    transition-all duration-200
                    group-hover:rotate-[-4deg]
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

                {/* Dish information */}
                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate text-[14px] font-extrabold text-gray-900"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {dish.dish_name}
                  </h3>

                  <p
                    className="
                      mt-1
                      line-clamp-2
                      text-[11px]
                      font-medium
                      leading-[1.4]
                      text-gray-500
                    "
                  >
                    {dish.review}
                  </p>
                </div>

                {/* Like button + count */}
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
                      flex h-[42px] w-[42px]
                      items-center justify-center
                      rounded-full
                      transition-all duration-200
                      active:scale-90
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#EF6B5B]
                      focus-visible:ring-offset-2
                      ${
                        isLiked
                          ? "bg-[#FFF0ED] text-[#E85D4A]"
                          : "bg-[#FFF8E9] text-gray-400 hover:scale-105 hover:bg-[#FFF0ED] hover:text-[#E85D4A]"
                      }
                    `}
                  >
                    <span
                      className={`
                        text-[22px] leading-none
                        ${isLiked ? "animate-[heartPop_0.4s_ease-out]" : ""}
                      `}
                    >
                      {isLiked ? "♥" : "♡"}
                    </span>
                  </button>

                  {/* Like count */}
                  <div
                    className={`
                      mt-1
                      flex items-center gap-1
                      text-[10px]
                      font-bold
                      leading-none
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
