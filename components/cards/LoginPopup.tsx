"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
interface LoginPopupProps {
  onClose: () => void;
}

export default function LoginPopup({ onClose }: LoginPopupProps) {
  
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // for Vibration feedback on phone
  const haptic = (duration: number) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(duration);
    }
  };

  const handleLogin = () => {
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
  };

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-50 bg-black/25 backdrop-blur-sm" />

      {/* popup */}
      <div
        className="
          fixed left-1/2 top-1/2 z-50
          w-[90%] max-w-sm
          -translate-x-1/2 -translate-y-1/2
          rounded-[32px]
          bg-[#FFFCF5]
          border-2 border-[#1F2937]
          px-7 py-8
          text-center
          shadow-[8px_8px_0_#1F2937]
          animate-in fade-in zoom-in-95 duration-200
        "
      >
        {/* icon */}
        <div
          className="
            mx-auto mb-5
            flex h-20 w-20 items-center justify-center
            rounded-[24px]
            bg-yellow-300
            border-2 border-black
            text-4xl
            shadow-[4px_4px_0_black]
          "
        >
          🗺️
        </div>

        {/* text */}
        <h2 className="text-2xl font-black tracking-tight text-gray-900">
          Join the campus
        </h2>

        <p className="mx-auto mt-3 max-w-[240px] text-sm leading-relaxed text-gray-500">
          Sign in to interact, post, and explore what NITRians are up to.
        </p>

        {/* actions */}
        <div className="mt-7 space-y-3">
          <button
            onClick={() => {
              haptic(18);
              startTransition(handleLogin);
            }}
            className="
              group
              flex h-12 w-full items-center justify-center gap-2
              rounded-2xl
              border-2 border-black
              bg-[#FFB703]
              font-black text-sm text-black
              shadow-[0_4px_0_#000]
              transition-all duration-200
              hover:-translate-y-1
              hover:shadow-[0_6px_0_#000]
              active:translate-y-1
              active:shadow-[0_2px_0_#000]
            "
          >
            <span>{isPending ? "Loading..." : "Login with Google"}</span>
            <span className="transition-transform group-hover:translate-x-1">
              🚀
            </span>
          </button>

          <button
            onClick={() => {
              haptic(8);
              onClose();
            }}
            className="
    h-11 w-full
    rounded-2xl
    border-2 border-gray-200
    bg-white
    font-bold text-sm text-gray-600
    transition-colors
    hover:bg-gray-50
  "
          >
            Maybe Later
          </button>
        </div>
      </div>
    </>
  );
}
