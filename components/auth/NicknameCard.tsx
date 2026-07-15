"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ── SHA-256 in the browser ─────────────────────────────────────
// raw roll number never leaves the device
async function sha256(text: string): Promise<string> {
  const encoded = new TextEncoder().encode(text.trim().toUpperCase());
  const buffer  = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const AVATARS = [
  "😎","🤓","🤠","😈","🫠","🤯",
  "🥱","👻","🗿","💀","🐵","🦥",
];

const MAX_NICKNAME_LENGTH = 24;

type ApiError = {
  code?: string;
  message?: string;
};

// ── Validation ─────────────────────────────────────────────────

function validateNickname(value: string): string | null {
  const nickname = value.trim();

  if (!nickname) {
    return "Nickname is required.";
  }

  if (nickname.length < 4) {
    return "Minimum 4 characters.";
  }

  if (nickname.length > MAX_NICKNAME_LENGTH) {
    return `Maximum ${MAX_NICKNAME_LENGTH} characters.`;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
    return "Only letters, numbers and underscores. No spaces.";
  }

  return null;
}

function validateRollNumber(value: string): string | null {
  const roll = value.trim().toUpperCase();

  if (!roll) {
    return "Roll number is required.";
  }

  // Example: 124ME0100
  if (!/^\d{3}[A-Z]{2}\d{4}$/.test(roll)) {
    return "Invalid roll number format.";
  }

  return null;
}

interface NicknameCardProps {
  onDismiss?: () => void;
}

export function NicknameCard({ onDismiss }: NicknameCardProps) {
  const router = useRouter();

  const [avatar,          setAvatar]          = useState("😎");
  const [rollNumber,      setRollNumber]      = useState("");
  const [nickname,        setNickname]        = useState("");
  const [validationError, setValidationError] = useState("");

  // ── Mutation ────────────────────────────────────────────────
  const completeProfileMutation = useMutation({
    mutationFn: async () => {
      const normalizedRoll    = rollNumber.trim().toUpperCase();
      const roll_number_hash  = await sha256(normalizedRoll);

      const res = await fetch("/api/auth/complete-profile", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          nickname: nickname.trim(),
          avatar,
          roll_number_hash,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw {
          code:    data?.error?.code,
          message: data?.error?.message,
        } satisfies ApiError;
      }

      return data;
    },

    onSuccess() {
      // re-runs the server component on the page
      // server reads has_profile cookie → true
      // AuthGate no longer mounts OnboardingOverlay
      router.refresh();
    },
  });

  // ── Error message ───────────────────────────────────────────
  const getErrorMessage = (): string => {
    if (validationError) return validationError;

    if (!completeProfileMutation.error) return "";

    const error = completeProfileMutation.error as ApiError;

    const messages: Record<string, string> = {
      PROFILE_EXISTS:      "You already have a profile.",
      ROLL_NUMBER_EXISTS:  "This roll number is already registered.",
      NICKNAME_TAKEN:      "This nickname is already taken.",
      UNAUTHORIZED:        "Session expired. Please sign in again.",
      INVALID_NICKNAME:    "Invalid nickname.",
      INVALID_ROLL_NUMBER: "Invalid roll number.",
    };

    return (
      messages[error.code ?? ""] ??
      error.message ??
      "Something went wrong."
    );
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = () => {
    const rollError     = validateRollNumber(rollNumber);
    const nicknameError = validateNickname(nickname);

    if (rollError || nicknameError) {
      setValidationError(rollError ?? nicknameError ?? "");
      return;
    }

    setValidationError("");
    completeProfileMutation.mutate();
  };

  const canSubmit =
    rollNumber.trim().length > 0 &&
    nickname.trim().length   > 0 &&
    !completeProfileMutation.isPending;

  const errorMessage = getErrorMessage();

  // ── Render ──────────────────────────────────────────────────
  return (
    <div
      className="
        relative w-full max-w-md mx-auto
        rounded-[28px] sm:rounded-[36px]
        bg-[#FFFCF5]
        border-[3px] border-[#1F2937]
        p-5 sm:p-7
        shadow-[6px_6px_0px_#1F2937] sm:shadow-[8px_8px_0px_#1F2937]
      "
    >
      {/* close button */}
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="
            absolute -top-4 -right-4
            h-9 w-9 rounded-full
            bg-white border-2 border-black
            flex items-center justify-center
            text-xl font-black text-black
            shadow-[3px_3px_0px_#000]
            transition-all hover:bg-red-400 hover:scale-110 active:scale-95
          "
        >
          ×
        </button>
      )}

      {/* NEW sticker */}
      <div className="absolute -left-4 -top-4 rotate-[-12deg] rounded-full bg-yellow-300 px-4 py-2 text-xs sm:text-sm font-bold text-black border-2 border-black">
        NEW ✨
      </div>

      {/* floating emoji */}
      <div className="absolute -left-4 bottom-24 rotate-[-10deg] text-3xl sm:text-4xl hidden sm:block">
        🎒
      </div>

      {/* header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-black bg-gradient-to-br from-white to-gray-100 text-6xl shadow-[0_6px_0px_#000] transition-all duration-300 hover:-translate-y-1 hover:rotate-3">
          <span className="drop-shadow-sm">{avatar}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black leading-tight text-gray-900">
          Campus Card
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-gray-500">
          Everyone gets a campus personality.
          <br />
          Choose yours!
        </p>
      </div>

      {/* avatar picker */}
      <div className="mt-6">
        <p className="mb-3 text-sm font-bold text-gray-700">
          Pick your avatar
        </p>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setAvatar(emoji)}
              className={`
                aspect-square rounded-xl border-2 text-2xl
                transition-all duration-200 hover:scale-105
                ${avatar === emoji
                  ? "border-black bg-yellow-300 shadow-md"
                  : "border-gray-200 bg-white hover:bg-gray-100"}
              `}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* inputs */}
      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="rollNumber"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            🎓 Roll Number
          </label>
          <Input
            id="rollNumber"
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="eg: 124ME0100"
            autoComplete="off"
            className="
              h-12 rounded-2xl border-2 border-gray-200
              bg-white text-black text-lg font-bold tracking-wide
              [font-family:'Arial_Rounded_MT_Bold','Arial_Rounded_MT',sans-serif]
              placeholder:font-sans placeholder:font-normal placeholder:text-gray-400
            "
          />
          <p className="mt-1.5 text-[11px] text-gray-400">
            🔒 Hashed in your browser — never stored as plain text.
          </p>
        </div>

        <div>
          <label
            htmlFor="nickname"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            ✨ Campus Nickname
          </label>
          <Input
            id="nickname"
            value={nickname}
            maxLength={MAX_NICKNAME_LENGTH}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="eg: LailaBadmosh"
            autoComplete="off"
            className="
              h-12 rounded-2xl border-2 border-gray-200
              bg-white text-black text-lg font-bold tracking-wide
              [font-family:'Arial_Rounded_MT_Bold','Arial_Rounded_MT',sans-serif]
              placeholder:font-sans placeholder:font-normal placeholder:text-gray-400
            "
          />
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <span>Examples: WiFiPirate, MaggiMonster, BunksKing...</span>
            <span>{nickname.length}/{MAX_NICKNAME_LENGTH}</span>
          </div>
        </div>

        {/* error */}
        {errorMessage && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            ⚠️ {errorMessage}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="
            h-14 w-full rounded-2xl
            border-[3px] border-black
            bg-[#FFB703] text-lg font-black text-black
            shadow-[0_6px_0px_#000]
            transition-all duration-150
            hover:translate-y-[1px] hover:shadow-[0_5px_0px_#000]
            active:translate-y-[6px] active:shadow-none
            disabled:opacity-40 disabled:cursor-not-allowed
            disabled:hover:translate-y-0 disabled:hover:shadow-[0_6px_0px_#000]
          "
        >
          {completeProfileMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Setting up your card...
            </span>
          ) : (
            "Join Campus 🚀"
          )}
        </Button>

        <p className="text-center text-xs text-gray-400">
          🤫 Your real identity stays hidden
        </p>
      </div>
    </div>
  );
}