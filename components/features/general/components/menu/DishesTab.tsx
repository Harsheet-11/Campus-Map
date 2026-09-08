"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const user = useUserStore((s) => s.user);
  const hasHydrated = useUserStore((s) => s._hasHydrated);

  const dishes = data?.food_items ?? [];
  const serverVotes = data?.user_votes ?? {};

  const [pendingVotes, setPendingVotes] = useState<Record<string, "UP" | null>>(
    {},
  );
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Clean up any pending timers when the component unmounts
  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

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

  if (dishes.length === 0) {
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
    if (!hasHydrated) return;
    if (!user) {
      onLoginRequired();
      return;
    }

    const current: "UP" | null =
      pendingVotes[dishId] !== undefined
        ? pendingVotes[dishId]
        : serverVotes[dishId] === "UP"
          ? "UP"
          : null;

    const next: "UP" | null = current === "UP" ? null : "UP";

    setPendingVotes((prev) => ({ ...prev, [dishId]: next }));

    clearTimeout(timers.current[dishId]);

    timers.current[dishId] = setTimeout(async () => {
      try {
        const res = await fetch(`/api/food/${dishId}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vote_type: next }),
        });

        if (res.status === 401) {
          setPendingVotes((prev) => {
            const c = { ...prev };
            delete c[dishId];
            return c;
          });
          onLoginRequired();
          return;
        }

        if (!res.ok) throw new Error("Vote failed");

        await queryClient.invalidateQueries({
          queryKey: ["canteen-food", canteenId],
        });
      } catch (err) {
        console.error("Vote error:", err);
        setPendingVotes((prev) => {
          const c = { ...prev };
          delete c[dishId];
          return c;
        });
      }
    }, 3000);
  };

  const sorted = [...dishes].sort((a, b) => b.upvotes - a.upvotes);

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

      {/* Dish list */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1">
        <div className="space-y-3">
          {sorted.map((dish, index) => {
            const liked =
              pendingVotes[dish.id] !== undefined
                ? pendingVotes[dish.id] === "UP"
                : serverVotes[dish.id] === "UP";

            const likeCount =
              dish.upvotes +
              (pendingVotes[dish.id] === "UP" && serverVotes[dish.id] !== "UP"
                ? 1
                : 0) -
              (pendingVotes[dish.id] === null && serverVotes[dish.id] === "UP"
                ? 1
                : 0);

            const rankColor =
              index === 0
                ? "bg-[#FFE8A8] text-[#9A6A00]"
                : index === 1
                  ? "bg-[#FFE0D8] text-[#B85D4D]"
                  : index === 2
                    ? "bg-[#DFF1C9] text-[#618C35]"
                    : "bg-[#E1EBFF] text-[#5875B0]";

            return (
              <div
                key={dish.id}
                className={`
                  group relative flex items-center gap-3
                  rounded-[20px] border bg-white p-3
                  transition-all duration-200
                  ${
                    liked
                      ? "border-[#FFC4BC] shadow-[0_5px_18px_rgba(239,93,74,0.08)]"
                      : "border-gray-100 shadow-sm hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
                  }
                `}
              >
                {/* Rank */}
                <div
                  className={`relative flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-[15px] text-[16px] font-black transition-all duration-200 group-hover:rotate-[-4deg] ${rankColor}`}
                >
                  {index + 1}
                </div>

                {/* Info */}
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

                {/* Heart */}
                <div className="flex flex-shrink-0 flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleLike(dish.id)}
                    aria-pressed={liked}
                    aria-label={
                      liked
                        ? `Unlike ${dish.dish_name}`
                        : `Like ${dish.dish_name}`
                    }
                    className={`
                      flex h-[42px] w-[42px] items-center justify-center
                      rounded-full transition-all duration-200
                      active:scale-90 focus:outline-none
                      focus-visible:ring-2 focus-visible:ring-[#EF6B5B] focus-visible:ring-offset-2
                      ${
                        liked
                          ? "bg-[#FFF0ED] text-[#E85D4A]"
                          : "bg-[#FFF8E9] text-gray-400 hover:scale-105 hover:bg-[#FFF0ED] hover:text-[#E85D4A]"
                      }
                    `}
                  >
                    <span
                      className={`text-[22px] leading-none ${liked ? "animate-[heartPop_0.4s_ease-out]" : ""}`}
                    >
                      {liked ? "♥" : "♡"}
                    </span>
                  </button>

                  <div
                    className={`mt-1 flex items-center gap-1 text-[10px] font-bold leading-none transition-colors duration-200 ${liked ? "text-[#E85D4A]" : "text-gray-400"}`}
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
    </div>
  );
}
