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
    <div className="relative flex-shrink-0 bg-white font-sans">
      {/* Yellow gradient banner with organic curved bottom */}
      <div className="relative overflow-hidden">
        {/* Main yellow background */}
        <div className="relative bg-gradient-to-br from-[#FFE58A] via-[#FFDD70] to-[#FFD54F] pt-5 pb-16">
          {/* Warm glow spots */}
          <div
            className="absolute -top-8 -left-8 h-32 w-32 rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(circle, rgba(255,193,7,0.5) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -top-6 -right-10 h-36 w-36 rounded-full opacity-50"
            style={{
              background:
                "radial-gradient(circle, rgba(255,152,0,0.4) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute left-1/2 top-0 h-40 w-52 -translate-x-1/2 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255,248,225,0.7) 0%, transparent 70%)",
            }}
          />

          {/* Decorative curved lines */}
          <svg
            className="absolute top-4 left-4 h-8 w-12 opacity-30 pointer-events-none"
            viewBox="0 0 48 32"
            fill="none"
          >
            <path
              d="M2 20 Q 12 4, 24 16 T 46 8"
              stroke="#B45309"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <svg
            className="absolute top-6 right-5 h-6 w-10 opacity-25 pointer-events-none"
            viewBox="0 0 40 24"
            fill="none"
          >
            <path
              d="M2 16 Q 10 2, 20 12 T 38 6"
              stroke="#B45309"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Sparkle dots */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[20%] left-[15%] h-1 w-1 rounded-full bg-amber-700/50" />
            <div className="absolute top-[30%] right-[18%] h-1 w-1 rounded-full bg-amber-700/50" />
            <div className="absolute top-[55%] left-[10%] h-1 w-1 rounded-full bg-amber-800/40" />
            <div className="absolute top-[50%] right-[12%] h-1 w-1 rounded-full bg-amber-800/40" />
            <div className="absolute top-[15%] left-[50%] h-1 w-1 rounded-full bg-amber-700/40" />
          </div>

          {/* Sparkle stars */}
          <svg
            className="absolute top-[22%] left-[22%] h-2.5 w-2.5 opacity-60 pointer-events-none"
            viewBox="0 0 12 12"
            fill="#EA580C"
          >
            <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" />
          </svg>
          <svg
            className="absolute top-[42%] right-[22%] h-2 w-2 opacity-50 pointer-events-none"
            viewBox="0 0 12 12"
            fill="#EA580C"
          >
            <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" />
          </svg>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95"
            aria-label="Close"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={14}
              strokeWidth={2.5}
              className="text-gray-700"
            />
          </button>

          {/* Store logo with soft glow */}
          <div className="relative z-10 flex justify-center pt-2 pb-2">
            <div className="relative">
              <div className="absolute inset-0 scale-[1.6] rounded-full bg-yellow-200/50 blur-xl" />
              <div className="absolute inset-0 scale-[1.3] rounded-full bg-amber-100/40 blur-lg" />

              <div className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white shadow-lg ring-2 ring-white/60">
                <div className="relative w-10 h-10 flex flex-col items-center justify-end">
                  <div className="absolute top-0 left-0.5 right-0.5 h-3 rounded-t-md flex overflow-hidden">
                    <div className="flex-1 bg-red-500" />
                    <div className="flex-1 bg-white" />
                    <div className="flex-1 bg-red-500" />
                    <div className="flex-1 bg-white" />
                    <div className="flex-1 bg-red-500" />
                  </div>
                  <div className="w-full h-6 bg-amber-50 border border-amber-200 rounded-b-sm mt-3 flex items-center justify-center">
                    <div className="w-2.5 h-4 bg-amber-800 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="relative z-10 text-center px-6 pt-2">
            <h1
              className="text-[26px] font-extrabold text-gray-900 leading-tight drop-shadow-sm"
              style={{ letterSpacing: "-0.02em" }}
            >
              {spot.name}
            </h1>
            <p
              className="text-[13px] text-amber-900/75 mt-1 font-semibold leading-snug line-clamp-2"
              style={{ letterSpacing: "-0.005em" }}
            >
              {spot.description}
            </p>
          </div>
        </div>

        {/* Organic wavy bottom */}
        <div className="absolute -bottom-[1px] left-0 right-0 pointer-events-none">
          <svg
            className="absolute bottom-0 left-0 right-0 w-full"
            viewBox="0 0 400 50"
            preserveAspectRatio="none"
            style={{ height: "38px" }}
          >
            <path
              d="M0,28 C55,45 115,15 195,28 C275,42 340,15 400,25 L400,50 L0,50 Z"
              fill="#FFC947"
              opacity="0.55"
            />
          </svg>

          <svg
            className="absolute bottom-0 left-0 right-0 w-full"
            viewBox="0 0 400 50"
            preserveAspectRatio="none"
            style={{ height: "30px" }}
          >
            <path
              d="M0,32 C60,46 125,20 205,32 C285,42 345,18 400,30 L400,50 L0,50 Z"
              fill="#FFDD70"
              opacity="0.85"
            />
          </svg>

          <svg
            className="relative block w-full"
            viewBox="0 0 400 50"
            preserveAspectRatio="none"
            style={{ height: "26px" }}
          >
            <path
              d="M0,36 C50,48 108,22 188,34 C268,44 338,20 400,34 L400,50 L0,50 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}