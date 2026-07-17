"use client";

import { useMapStore } from "@/components/stores/mapStore";

export default function ModeToggle() {
  const mode    = useMapStore((s) => s.mode);
  const setMode = useMapStore((s) => s.setMode);

  return (
    <div
      className="
        absolute top-4 left-1/2 -translate-x-1/2 z-20
        flex items-center gap-1
        bg-[#FFFCF5] border-[2px] border-[#1F2937]
        rounded-2xl p-1
        shadow-[3px_3px_0_#1F2937]
      "
    >
      <button
        onClick={() => setMode("general")}
        className={`
          px-4 py-1.5 rounded-xl text-sm font-black transition-all
          ${mode === "general"
            ? "bg-yellow-300 border-[2px] border-[#1F2937] shadow-[2px_2px_0_#1F2937]"
            : "text-gray-500 hover:text-gray-800"
          }
        `}
      >
        ☀️ General
      </button>
      <button
        onClick={() => setMode("lore")}
        className={`
          px-4 py-1.5 rounded-xl text-sm font-black transition-all
          ${mode === "lore"
            ? "bg-purple-900 text-purple-100 border-[2px] border-[#1F2937] shadow-[2px_2px_0_#1F2937]"
            : "text-gray-500 hover:text-gray-800"
          }
        `}
      >
        👻 Lore
      </button>
    </div>
  );
}