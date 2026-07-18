"use client";

import { useState, useEffect, useRef } from "react";
import { useMapStore } from "@/components/stores/mapStore";

export default function ModeToggle() {
  const mode = useMapStore((s) => s.mode);
  const setMode = useMapStore((s) => s.setMode);

  const [showFestSoon, setShowFestSoon] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleFestClick() {
    if (timerRef.current) clearTimeout(timerRef.current);

    setShowFestSoon(true);

    timerRef.current = setTimeout(() => {
      setShowFestSoon(false);
    }, 2500);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      {/* ───────── Center Popup ───────── */}
      {showFestSoon && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="
              w-[90%] max-w-md
              bg-[#FFFCF5]
              border-[3px] border-[#1F2937]
              rounded-3xl
              shadow-[8px_8px_0_#1F2937]
              p-8
              text-center
              animate-in zoom-in-95 fade-in duration-200
            "
          >
            <div className="text-7xl mb-4">🎉</div>

            <h2 className="text-3xl font-black text-[#1F2937]">
              Fest Mode
            </h2>

            <p className="mt-3 text-lg font-bold text-orange-500">
              Coming Soon!
            </p>

            <p className="mt-4 text-gray-600">
              Explore festivals, decorations, event locations, and much more in
              a future update.
            </p>

            <button
              onClick={() => setShowFestSoon(false)}
              className="
                mt-8
                px-6 py-3
                bg-orange-400
                text-white
                font-black
                rounded-xl
                border-[2px] border-[#1F2937]
                shadow-[3px_3px_0_#1F2937]
                hover:translate-y-[1px]
                hover:shadow-[2px_2px_0_#1F2937]
                transition-all
              "
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* ───────── Mode Toggle ───────── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div
          className="
            flex items-center gap-1
            bg-[#FFFCF5]
            border-[2px] border-[#1F2937]
            rounded-2xl
            p-1
            shadow-[3px_3px_0_#1F2937]
          "
        >
          {/* General */}
          <button
            onClick={() => setMode("general")}
            className={`
              px-4 py-1.5 rounded-xl text-sm font-black transition-all
              ${
                mode === "general"
                  ? "bg-yellow-300 border-[2px] border-[#1F2937] shadow-[2px_2px_0_#1F2937]"
                  : "text-gray-500 hover:text-gray-800"
              }
            `}
          >
            ☀️ General
          </button>

          {/* Lore */}
          <button
            onClick={() => setMode("lore")}
            className={`
              px-4 py-1.5 rounded-xl text-sm font-black transition-all
              ${
                mode === "lore"
                  ? "bg-purple-900 text-purple-100 border-[2px] border-[#1F2937] shadow-[2px_2px_0_#1F2937]"
                  : "text-gray-500 hover:text-gray-800"
              }
            `}
          >
            👻 Lore
          </button>

          {/* Fest */}
          <button
            onClick={handleFestClick}
            className="
              px-4 py-1.5
              rounded-xl
              text-sm
              font-black
              transition-all
              text-gray-400
              hover:text-orange-400
            "
          >
            🎉 Fest
          </button>
        </div>
      </div>
    </>
  );
}