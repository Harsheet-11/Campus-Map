"use client";

import { useMapStore } from "@/components/stores/mapStore";

const TICKER_TEXT =
  "⚠️ Do not open this mode during class. We are not responsible for whatever happens next.";

export default function LoreTicker() {
  const mode = useMapStore((s) => s.mode);

  if (mode !== "lore") return null;

  return (
  <div
  className="
    fixed
    bottom-0
    left-0
    right-0
    z-[99999]
    h-10
    overflow-hidden
    bg-blue-950/95
    border-t
    border-blue-700
    flex
    items-center
  "
>
    <div
      className="flex whitespace-nowrap items-center"
      style={{
        animation: "ticker 20s linear infinite",
      }}
    >
      {[...Array(6)].map((_, i) => (
        <span
          key={i}
          className="text-blue-200 text-[11px] sm:text-xs font-bold mr-16"
        >
          {TICKER_TEXT}
        </span>
      ))}
    </div>
  </div>
);
}