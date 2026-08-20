"use client";

import { useEffect, useRef } from "react";
import type { LoreSpotFull } from "@/lib/types";

import LoreHeader from "./LoreHeader";
import LoreContent from "./LoreContent";
import LoreCloseButton from "./LoreCloseButton";

interface Props {
  story: LoreSpotFull;
  onClose: () => void;
}

export default function LoreSheet({ story, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="
        fixed
        inset-0
        z-[600]

        flex
        items-center
        justify-center

        bg-black/75
        backdrop-blur-md

        p-4
        sm:p-6
      "
    >
      {/* =================================================
          STORY SHEET
      ================================================== */}
      <section
        aria-label={story.title}
        className="
          relative

          w-[94vw]
          max-w-[900px]

          h-[88vh]
          max-h-[88vh]

          overflow-hidden

          rounded-[28px]

          border
          border-white/40

          bg-[#eeeade]

          shadow-[0_30px_100px_rgba(0,0,0,0.65)]

          animate-in
          fade-in
          zoom-in-95
          duration-300
        "
      >
        {/* =================================================
            PAPER BASE
        ================================================== */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
          "
          style={{
            background: `
              linear-gradient(
                135deg,
                rgba(255,255,255,0.32),
                rgba(238,234,218,0.95)
              )
            `,
          }}
        />

        {/* =================================================
            PAPER LINES
        ================================================== */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[1]
            opacity-30
          "
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 32px,
                rgba(70,55,35,0.055) 32px,
                rgba(70,55,35,0.055) 33px
              )
            `,
          }}
        />

        {/* =================================================
            PAPER GRAIN
        ================================================== */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-[2]
            opacity-[0.22]
          "
          style={{
            backgroundImage: `
              radial-gradient(
                rgba(50,40,25,0.14) 0.7px,
                transparent 0.7px
              )
            `,
            backgroundSize: "5px 5px",
          }}
        />

        {/* =================================================
            VIGNETTE
        ================================================== */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-30
            rounded-[28px]
          "
          style={{
            boxShadow: `
              inset 0 0 80px rgba(45,30,15,0.12),
              inset 0 -25px 40px rgba(45,30,15,0.05)
            `,
          }}
        />

        {/* =================================================
            HEADER
        ================================================== */}
        <LoreHeader story={story} />

        {/* =================================================
            CONTENT
        ================================================== */}
        <LoreContent story={story} />

        {/* =================================================
            CLOSE BUTTON
        ================================================== */}
        <LoreCloseButton onClose={onClose} />

        {/* =================================================
            BOTTOM FADE
        ================================================== */}
        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            left-0
            right-0

            z-20

            h-24
          "
          style={{
            background:
              "linear-gradient(to top, rgba(238,234,218,0.98), transparent)",
          }}
        />
      </section>
    </div>
  );
}
