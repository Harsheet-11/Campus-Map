"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { PermanentSpot } from "@/lib/types";

export default function MenuHeader({
  spot,
  onClose,
}: {
  spot: PermanentSpot;
  onClose?: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-b-[32px]">
      {/* Main playful background */}
      <div className="relative bg-[#FFD45A] px-5 pb-10 pt-4">
        {/* Soft background shapes */}
        <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-[#FFE89A]" />

        <div className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rounded-full bg-[#FFC44D]" />

        <div
          className="
            pointer-events-none
            absolute left-1/2 top-0
            h-40 w-64
            -translate-x-1/2
            rounded-full
            bg-white/25
            blur-2xl
          "
        />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="
            absolute right-4 top-4 z-30
            flex h-9 w-9
            items-center justify-center
            rounded-full
            bg-white
            text-gray-700
            shadow-[0_3px_0_rgba(0,0,0,0.08)]
            transition-all duration-200
            hover:-rotate-6
            hover:scale-105
            active:scale-90
          "
        >
          <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2.5} />
        </button>

        {/* Logo */}
        <div className="relative z-10 flex justify-center">
          <div className="relative">
            {/* Simple playful shadow */}
            <div
              className="
                absolute inset-0
                translate-y-2
                scale-[0.88]
                rounded-full
                bg-[#D99A25]/25
                blur-md
              "
            />

            <div
              className="
                relative
                flex h-[70px] w-[70px]
                items-center justify-center
                rounded-full
                border-[3px] border-white
                bg-white
                shadow-[0_6px_0_rgba(177,116,20,0.15)]
                transition-transform duration-300
                hover:rotate-3 hover:scale-105
              "
            >
              {/* Simple CSS storefront */}
              <div className="relative h-10 w-10">
                <div className="absolute left-0.5 right-0.5 top-0 flex h-3 overflow-hidden rounded-t-md">
                  <div className="flex-1 bg-[#EF5350]" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-[#EF5350]" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-[#EF5350]" />
                </div>

                <div
                  className="
                    absolute bottom-0 left-0
                    flex h-7 w-full
                    items-center justify-center
                    rounded-b-md
                    border border-[#E9C77D]
                    bg-[#FFF8E7]
                  "
                >
                  <div className="h-4 w-2.5 rounded-sm bg-[#A66A25]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="relative z-10 mt-4 w-full px-4 text-center">
          <h1
            className="
      mx-auto
      max-w-[360px]
      text-center
      text-[32px]
      font-black
      leading-[1.05]
      text-[#191919]
    "
            style={{ letterSpacing: "-0.045em" }}
          >
            {spot.name}
          </h1>

          <p
            className="
      mx-auto mt-2
      max-w-[290px]
      text-center
      line-clamp-2
      text-[12px]
      font-semibold
      leading-[1.45]
      text-[#805C16]
    "
          >
            {spot.description}
          </p>
        </div>
        {/* Small playful accent */}
        <div
          className="
            absolute
            bottom-7 left-1/2
            h-1.5 w-8
            -translate-x-1/2
            rounded-full
            bg-[#E7A928]
          "
        />
      </div>

      {/* Simple organic bottom */}
      <div className="relative -mt-5 h-8">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 35"
          preserveAspectRatio="none"
        >
          <path
            d="
              M0 13
              C55 28, 105 28, 160 15
              C220 2, 270 27, 325 16
              C355 10, 380 11, 400 17
              L400 35
              L0 35
              Z
            "
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
