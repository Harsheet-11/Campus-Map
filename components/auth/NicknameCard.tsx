"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NicknameCard() {
  const vibes = [
    "🍜 Food Hunter",
    "🌙 Night Owl",
    "📚 Library Ghost",
    "⚡ Last Minute",
  ];

  // 1. Add state for the inputs and the checking status
  const [studentId, setStudentId] = useState("");
  const [nickname, setNickname] = useState("");
  const [nameStatus, setNameStatus] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle");
  const [selectedVibe, setSelectedVibe] = useState("");

  // 2. Debounced effect to check availability
  useEffect(() => {
    // Only check if they typed at least 3 characters
    if (nickname.trim().length < 3) {
      setNameStatus("idle");
      return;
    }

    setNameStatus("checking");

    // Wait 500ms after the user stops typing before calling the API
    const debounceTimer = setTimeout(async () => {
      try {
        // NOTE: Adjust this URL to wherever your API route is located
        // (e.g., /api/check-nickname)
        const res = await fetch(`/api/check-nickname?name=${encodeURIComponent(nickname.trim())}`);
        const data = await res.json();
        
        setNameStatus(data.available ? "available" : "taken");
      } catch (error) {
        console.error("Failed to check nickname:", error);
        setNameStatus("error");
      }
    }, 500);

    // Cleanup the timer if they keep typing
    return () => clearTimeout(debounceTimer);
  }, [nickname]);

  // 3. Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameStatus !== "available" || !studentId || !selectedVibe) return;

    // TODO: Submit the final form data to your backend
    console.log({ studentId, nickname, selectedVibe });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
      relative
      w-full
      max-w-md
      mx-auto
      rounded-[28px]
      sm:rounded-[36px]
      bg-[#FFFCF5]
      border-[3px]
      border-[#1F2937]
      p-5
      sm:p-7
      shadow-[6px_6px_0px_#1F2937]
      sm:shadow-[8px_8px_0px_#1F2937]
      "
    >
      {/* Sticker */}
      <div className="absolute -right-3 -top-3 sm:-right-5 sm:-top-5 rotate-12 rounded-full bg-yellow-300 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold border-2 border-black">
        NEW ✨
      </div>

      {/* Floating emoji */}
      <div className="absolute -left-4 bottom-20 rotate-[-10deg] text-3xl sm:text-4xl hidden sm:block">
        🎒
      </div>

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 sm:mb-5 flex h-16 w-16 sm:h-20 w-20 items-center justify-center rounded-full bg-orange-300 text-4xl sm:text-5xl border-2 border-black">
          🗺️
        </div>

        <h1 className="text-2xl sm:text-3xl font-black leading-tight text-gray-900">
          Make Your
          <br />
          Campus Card
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-gray-500">
          Everyone gets a campus personality.
          <br />
          What's yours?
        </p>
      </div>

      {/* Inputs */}
      <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            🎓 Student number
          </label>
          <Input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="22CS101"
            required
            className="h-11 sm:h-12 rounded-2xl border-2 border-gray-200 bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            ✨ Campus nickname
          </label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="MaggiMonster"
            required
            className={`
              h-11 sm:h-12 rounded-2xl border-2 bg-white transition-colors
              ${nameStatus === "available" ? "border-green-400 focus-visible:ring-green-400" : ""}
              ${nameStatus === "taken" ? "border-red-400 focus-visible:ring-red-400" : ""}
              ${nameStatus === "idle" || nameStatus === "checking" ? "border-gray-200" : ""}
            `}
          />
          
          {/* Dynamic feedback message based on status */}
          <div className="mt-2 text-xs font-medium h-4">
            {nameStatus === "idle" && (
              <span className="text-gray-400">Examples: MaggiMonster, WiFiPirate...</span>
            )}
            {nameStatus === "checking" && (
              <span className="text-gray-500 flex items-center gap-1">
                <span className="animate-spin inline-block">⏳</span> Checking availability...
              </span>
            )}
            {nameStatus === "available" && (
              <span className="text-green-600">✅ Nickname is available!</span>
            )}
            {nameStatus === "taken" && (
              <span className="text-red-500">❌ Oops, someone took that name.</span>
            )}
            {nameStatus === "error" && (
              <span className="text-red-500">⚠️ Error checking name. Try again.</span>
            )}
          </div>
        </div>

        {/* Personality */}
        <div>
          <p className="mb-3 text-sm font-bold text-gray-700">
            Pick your campus vibe
          </p>
          <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2">
            {vibes.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setSelectedVibe(v)}
                className={`
                  rounded-2xl border-2 px-3 py-3 text-sm font-medium transition
                  ${selectedVibe === v 
                    ? "border-orange-400 bg-orange-100 text-orange-800 shadow-[2px_2px_0px_#F97316]" 
                    : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50"}
                `}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Button */}
        <Button
          type="submit"
          disabled={nameStatus !== "available" || !studentId || !selectedVibe}
          className="
            h-14 sm:h-16 w-full rounded-2xl border-[3px] border-black bg-[#FFB703] 
            text-black font-black text-base sm:text-lg 
            shadow-[0_5px_0px_#000] sm:shadow-[0_6px_0px_#000] 
            hover:translate-y-1 hover:shadow-[0_3px_0px_#000] 
            active:translate-y-2 active:shadow-[0_0px_0px_#000]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_5px_0px_#000]
            transition-all
          "
        >
          Join Campus 🚀
        </Button>

        <p className="text-center text-xs text-gray-400">
          🤫 Your real identity stays hidden
        </p>
      </div>
    </form>
  );
}