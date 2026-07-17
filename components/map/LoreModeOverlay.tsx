"use client";

import { useMapStore } from "@/components/stores/mapStore";

export default function LoreModeOverlay() {
  const mode   = useMapStore((s) => s.mode);
  const isLore = mode === "lore";

  if (!isLore) return null;

  return (
    <>
      {/* Dark overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-[1500ms]"
        style={{
          background: "rgba(13, 13, 15, 0.65)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Film grain */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          animation: "lore-grain 0.5s steps(1) infinite",
        }}
      />

      {/* Top fog */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 opacity-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(45, 27, 61, 0.8), transparent)",
        }}
      />

      {/* Bottom fog */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 opacity-40"
        style={{
          background:
            "linear-gradient(to top, rgba(13, 13, 15, 0.9), transparent)",
        }}
      />
    </>
  );
}