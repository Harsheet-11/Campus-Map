"use client";

import { useLoreStore } from "@/stores/loreSpotStore";
import { SCARE_ASSETS, stopScareAudio } from "@/hooks/scarePreloader";

export default function ScareOverlay() {
  const scarePhase = useLoreStore((state) => state.scarePhase);
  const setScarePhase = useLoreStore((state) => state.setScarePhase);
  const setAction = useLoreStore((state) => state.setAction);

  if (!scarePhase) return null;

  // Close the scare and open the lore sheet.
  const dismissRoast = () => {
    stopScareAudio();
    setScarePhase(null);
    setAction("LORE_SHEET");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Jump scare */}
      {scarePhase === "SCARE" && (
        <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black">
          <img
            src={SCARE_ASSETS.image}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="h-full w-full select-none object-cover"
            style={{ animation: "scare-shake 0.12s linear infinite" }}
          />
        </div>
      )}

      {/* Roast screen */}
      {scarePhase === "ROAST" && (
        <button
          type="button"
          onClick={dismissRoast}
          className="
            flex h-full w-full cursor-pointer flex-col
            items-center justify-center gap-6 bg-black
            px-6 text-white
          "
        >
          <img
            src={SCARE_ASSETS.roastImage}
            alt="Behen dar gayi?"
            draggable={false}
            className="
              max-h-[65vh] max-w-[90vw] select-none
              rounded-2xl object-contain
              shadow-[0_0_50px_rgba(255,255,255,0.12)]
            "
          />

          <p className="text-center text-3xl font-black tracking-wide sm:text-4xl">
            behen dar gayi? 😏
          </p>

          <p className="text-sm uppercase tracking-[0.25em] text-white/50">
            tap anywhere to continue
          </p>
        </button>
      )}

      <style jsx>{`
        @keyframes scare-shake {
          0% {
            transform: translate(0, 0) scale(1.02);
          }
          20% {
            transform: translate(-5px, 3px) scale(1.04);
          }
          40% {
            transform: translate(4px, -4px) scale(1.03);
          }
          60% {
            transform: translate(-4px, -2px) scale(1.05);
          }
          80% {
            transform: translate(3px, 4px) scale(1.03);
          }
          100% {
            transform: translate(0, 0) scale(1.02);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          img {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
