"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nitr-cinematic-done";

interface Props {
  onComplete: () => void;
}

export default function CinematicSequence({ onComplete }: Props) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function enterMap() {
    setFadeOut(true);

    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "true");
      onComplete();
    }, 500);
  }

  return (
    <div
      onClick={enterMap}
      className="absolute inset-0 z-[9999] flex items-center justify-center bg-black cursor-pointer transition-opacity duration-500"
      style={{
        opacity: fadeOut ? 0 : 1,
      }}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">
          WelCome to NITR
        </h1>

        <p className="mt-3 text-gray-300">
          Enter Campus
        </p>
      </div>
    </div>
  );
}