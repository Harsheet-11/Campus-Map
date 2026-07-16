"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { useUserStore } from "@/components/stores/userStore";

async function sha256(text: string): Promise<string> {
  // crypto.subtle is only available on HTTPS / localhost (secure contexts)
  if (typeof crypto === "undefined" || !crypto.subtle) {
    throw {
      code: "INSECURE_CONTEXT",
      message: "INSECURE_CONTEXT",
    };
  }

  const encoded = new TextEncoder().encode(text.trim().toUpperCase());
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const AVATARS = [
  "😎",
  "🤓",
  "🤠",
  "😈",
  "🫠",
  "🤯",
  "🥱",
  "👻",
  "🗿",
  "💀",
  "🐵",
  "🦥",
];

const MAX_NICKNAME_LENGTH = 24;

type ApiError = { code?: string; message?: string };

// ── Validation ─────────────────────────────────────────────────

function validateNickname(value: string): string | null {
  const nickname = value.trim();

  if (!nickname) {
    return "You forgot to pick a nickname! Everyone needs one 😄";
  }
  if (nickname.length < 4) {
    return `"${nickname}" is too short — add ${4 - nickname.length} more character${4 - nickname.length > 1 ? "s" : ""} 📏`;
  }
  if (nickname.length > MAX_NICKNAME_LENGTH) {
    return `Whoa, that's a mouthful! Keep it under ${MAX_NICKNAME_LENGTH} characters ✂️`;
  }
  if (/\s/.test(nickname)) {
    return "No spaces allowed — try an underscore instead (e.g. Laila_Badmosh) 🚫";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
    return "Only letters, numbers and _ please — no emojis or symbols 🙅";
  }

  return null;
}

function validateRollNumber(value: string): string | null {
  const roll = value.trim().toUpperCase();

  if (!roll) {
    return "Pop in your roll number so we can verify you're a student 🎓";
  }

  // wrong length but looks like letters+numbers → partially typed
  if (roll.length < 9) {
    return `Too short — roll numbers are 9 characters (you've typed ${roll.length}) 🔢`;
  }
  if (roll.length > 9) {
    return `Too long — roll numbers are exactly 9 characters (you've typed ${roll.length}) ✂️`;
  }

  // right length but wrong pattern — give targeted hints
  if (!/^\d{3}/.test(roll)) {
    return "Should start with 3 digits, like 124... (e.g. 124ME0100) 🔢";
  }
  if (!/^\d{3}[A-Z]{2}/.test(roll)) {
    return "Characters 4–5 should be your branch code, like ME or CS (e.g. 124ME0100) 🏫";
  }
  if (!/^\d{3}[A-Z]{2}\d{4}$/.test(roll)) {
    return "Last 4 characters should be digits, like ...0100 (e.g. 124ME0100) 🔢";
  }

  return null;
}

interface NicknameCardProps {
  onDismiss?: () => void;
}

export default function NicknameCard({ onDismiss }: NicknameCardProps) {
  const router = useRouter();

  const [avatar, setAvatar] = useState("😎");
  const [rollNumber, setRollNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [validationError, setValidationError] = useState("");

  const completeProfileMutation = useMutation({
    mutationFn: async () => {
      const normalizedRoll = rollNumber.trim().toUpperCase();
      const roll_number_hash = await sha256(normalizedRoll);
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          avatar,
          roll_number_hash,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw {
          code: data?.error?.code,
          message: data?.error?.message,
        } satisfies ApiError;
      }
      useUserStore.getState().setUser({
        id: data.user.id,
        npc_name: data.user.npc_name,
        avatar: data.user.avatar,
        hasProfile: true,
      });
      return data;
    },
    onSuccess() {
      router.refresh();
    },
  });

  // ── API error messages ──────────────────────────────────────────

  const getErrorMessage = (): string => {
    if (validationError) return validationError;
    if (!completeProfileMutation.error) return "";

    const error = completeProfileMutation.error as ApiError;

    const messages: Record<string, string> = {
      PROFILE_EXISTS:
        "Looks like you've already set up your campus card! Try refreshing the page 🔄",
      ROLL_NUMBER_EXISTS:
        "This roll number is already linked to another account — if that wasn't you, contact support 🚨",
      NICKNAME_TAKEN:
        "Someone already snagged that nickname! Try adding your lucky number or a twist 😅",
      UNAUTHORIZED:
        "Your session timed out — please sign in again and we'll pick up where you left off 🔑",
      INVALID_NICKNAME:
        "That nickname didn't pass our check — only letters, numbers and _ allowed 🙅",
      INVALID_ROLL_NUMBER:
        "That roll number doesn't look right on our end — double-check and try again 🎓",
      INSECURE_CONTEXT:
        "Your browser blocked this action because the page isn't loaded securely. Make sure the URL starts with https:// and try again 🔒",
    };

    return (
      messages[error.code ?? ""] ??
      error.message ??
      "Something went wrong on our side — give it another shot in a moment 🙏"
    );
  };

  const handleSubmit = () => {
    const rollError = validateRollNumber(rollNumber);
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
    nickname.trim().length > 0 &&
    !completeProfileMutation.isPending;

  const errorMessage = getErrorMessage();

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* ── Outer glow / halo ── */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-300 via-orange-200 to-pink-300 blur-2xl opacity-40 -z-10 scale-105" />

      {/* ── Card shell ── */}
      <div
        className="
          relative rounded-3xl overflow-hidden
          border-[3px] border-black
          shadow-[6px_6px_0px_#000]
          bg-white
        "
      >
        {/* ── Colourful top banner ── */}
        <div className="relative bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 px-5 pt-5 pb-10">
          {/* dot pattern overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, #000 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* NEW pill */}
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black px-2.5 py-0.5 text-[10px] font-black text-yellow-300 tracking-widest uppercase">
            ✦ New
          </div>

          {/* close */}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="
                absolute top-3 right-3
                h-7 w-7 rounded-full
                bg-black/10 border border-black/20
                flex items-center justify-center
                text-base font-black text-black/70
                transition-all hover:bg-black hover:text-white active:scale-95
              "
            >
              ×
            </button>
          )}

          {/* Avatar bubble */}
          <div className="relative z-10 flex justify-center mt-4">
            <div
              className="
                h-16 w-16 rounded-2xl
                border-[3px] border-black bg-white
                flex items-center justify-center text-4xl
                shadow-[4px_4px_0px_#000]
                transition-all duration-300 hover:-translate-y-1 hover:rotate-6
              "
            >
              {avatar}
            </div>
          </div>

          {/* Title */}
          <div className="relative z-10 text-center mt-2">
            <h1 className="text-lg font-black text-black tracking-tight">
              Campus Card
            </h1>
            <p className="text-[11px] text-black/60 mt-0.5">
              Your anonymous campus identity
            </p>
          </div>
        </div>

        {/* ── Zigzag / ticket tear divider ── */}
        <div className="relative -mt-5 z-10">
          <svg
            viewBox="0 0 400 20"
            className="w-full fill-white"
            preserveAspectRatio="none"
            height="20"
          >
            <path d="M0,20 L0,8 Q10,0 20,8 Q30,16 40,8 Q50,0 60,8 Q70,16 80,8 Q90,0 100,8 Q110,16 120,8 Q130,0 140,8 Q150,16 160,8 Q170,0 180,8 Q190,16 200,8 Q210,0 220,8 Q230,16 240,8 Q250,0 260,8 Q270,16 280,8 Q290,0 300,8 Q310,16 320,8 Q330,0 340,8 Q350,16 360,8 Q370,0 380,8 Q390,16 400,8 L400,20 Z" />
          </svg>
        </div>

        {/* ── Body ── */}
        <div className="px-5 pb-5 -mt-1 space-y-4">
          {/* Avatar picker */}
          <div>
            <p className="mb-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Pick your avatar
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {AVATARS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`
                    aspect-square rounded-xl text-xl
                    border-2 transition-all duration-150
                    hover:scale-110 active:scale-95
                    ${
                      avatar === emoji
                        ? "border-black bg-yellow-300 shadow-[0_3px_0_#000] scale-110"
                        : "border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white"
                    }
                  `}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
              details
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* Roll Number */}
          <div className="space-y-1">
            <label
              htmlFor="rollNumber"
              className="flex items-center gap-1.5 text-xs font-black text-gray-700"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-yellow-100 text-[11px]">
                🎓
              </span>
              Roll Number
            </label>
            <div className="relative">
              <Input
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="eg: 124ME0100"
                autoComplete="off"
                className="
                  h-10 rounded-xl border-2 border-gray-200 bg-gray-50
                  pr-4 pl-3
                  text-sm font-bold tracking-widest text-black
                  placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300
                  focus:border-yellow-400 focus:bg-white focus:ring-0
                  transition-colors
                "
              />
              {validateRollNumber(rollNumber) === null &&
                rollNumber.length > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">
                    ✓
                  </span>
                )}
            </div>
            <p className="text-[10px] text-gray-300 flex items-center gap-1">
              <span>🔒</span> Hashed locally — never stored as plain text
            </p>
          </div>

          {/* Nickname */}
          <div className="space-y-1">
            <label
              htmlFor="nickname"
              className="flex items-center gap-1.5 text-xs font-black text-gray-700"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-100 text-[11px]">
                ✨
              </span>
              Campus Nickname
            </label>
            <div className="relative">
              <Input
                id="nickname"
                value={nickname}
                maxLength={MAX_NICKNAME_LENGTH}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="eg: LailaBadmosh"
                autoComplete="off"
                className="
                  h-10 rounded-xl border-2 border-gray-200 bg-gray-50
                  pr-10 pl-3
                  text-sm font-bold tracking-wide text-black
                  placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-300
                  focus:border-purple-400 focus:bg-white focus:ring-0
                  transition-colors
                "
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 tabular-nums">
                {nickname.length}/{MAX_NICKNAME_LENGTH}
              </span>
            </div>
            <p className="text-[10px] text-gray-300">
              WiFiPirate · MaggiMonster · BunksKing
            </p>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-3 py-2">
              <span className="text-sm">⚠️</span>
              <p className="text-xs font-semibold text-red-500 leading-snug">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="
              group relative w-full h-11 rounded-xl
              border-[3px] border-black
              bg-gradient-to-r from-yellow-300 to-amber-400
              font-black text-sm text-black
              shadow-[0_4px_0px_#000]
              transition-all duration-150
              hover:shadow-[0_2px_0px_#000] hover:translate-y-0.5
              active:shadow-none active:translate-y-1
              disabled:opacity-40 disabled:cursor-not-allowed
              disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_0px_#000]
              overflow-hidden
            "
          >
            {/* shimmer on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />

            {completeProfileMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin text-base">⏳</span>
                Setting up...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                Join Campus
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  🚀
                </span>
              </span>
            )}
          </button>

          {/* Footer note */}
          <p className="text-center text-[10px] text-gray-300 font-medium">
            🤫 Your real identity stays hidden forever
          </p>
        </div>
      </div>
    </div>
  );
}
