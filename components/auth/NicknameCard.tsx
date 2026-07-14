"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AVATARS = [
   "🤓",
   "😎", 
   "🥱",  
   "🫠", 
   "🤯", 
   "👻", 
   "🗿", 
   "😈",   
   "🐸",  
   "🦥",  
   "💀", 
   "🤠", 
];

export function NicknameCard() {
  const [avatar, setAvatar] = useState("😀");
  const [rollNumber, setRollNumber] = useState("");
  const [nickname, setNickname] = useState("");
  const [showCard, setShowCard] = useState(true);

  const handleSubmit = () => {
    console.log({
      avatar,
      rollNumber,
      nickname,
    });
  };

  if (!showCard) return null;

  return (
    <div
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

      {/* Close Button */}
      <button
        type="button"
        onClick={() => setShowCard(false)}
        className="
          absolute
          -top-4
          -right-4
          h-9
          w-9
          rounded-full
          bg-white
          border-2
          border-black
          flex
          items-center
          justify-center
          text-xl
          font-black
          text-black
          shadow-[3px_3px_0px_#000]
          transition-all
          hover:bg-red-400
          hover:scale-110
          active:scale-95
        "
      >
        ×
      </button>


      {/* NEW Sticker */}
      <div
        className="
          absolute
          -left-4
          -top-4
          rotate-[-12deg]
          rounded-full
          bg-yellow-300
          px-4
          py-2
          text-xs
          sm:text-sm
          font-bold
          text-black
          border-2
          border-black
        "
      >
        NEW ✨
      </div>


      {/* Floating emoji */}
      <div
        className="
          absolute
          -left-4
          bottom-24
          rotate-[-10deg]
          text-3xl
          sm:text-4xl
          hidden
          sm:block
        "
      >
        🎒
      </div>


      {/* Header */}
      <div className="text-center">

        <div
  className="
    mx-auto
    mb-4
    flex
    h-24
    w-24
    items-center
    justify-center
    rounded-full
    border-[3px]
    border-black
    bg-gradient-to-br
    from-white
    to-gray-100
    text-6xl
    shadow-[0_6px_0px_#000]
    transition-all
    duration-300
    hover:-translate-y-1
    hover:rotate-3
  "
>
  <span className="drop-shadow-sm">
    {avatar}
  </span>
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


      {/* Avatar Picker */}
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
                aspect-square
                rounded-xl
                border-2
                text-2xl
                transition-all
                duration-200
                hover:scale-105

                ${
                  avatar === emoji
                    ? "border-black bg-yellow-300 shadow-md"
                    : "border-gray-200 bg-white hover:bg-gray-100"
                }
              `}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>


      {/* Inputs */}
      <div className="mt-6 space-y-5">

        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            🎓 Roll Number
          </label>

          <Input
            value={rollNumber}
            onChange={(e) => setRollNumber(e.target.value)}
            placeholder="eg: 124ME0100"
            className="
              h-12
              rounded-2xl
              border-2
              border-gray-200
              bg-white
            "
          />
        </div>


        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            ✨ Campus Nickname
          </label>

          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="eg: LailaBadmosh"
            className="
              h-12
              rounded-2xl
              border-2
              border-gray-200
              bg-white
            "
          />

          <div className="mt-2 text-xs text-gray-400">
            Examples: WiFiPirate, MaggiMonster, BunksKing...
          </div>
        </div>


        <Button
          onClick={handleSubmit}
          className="
            h-14
            w-full
            rounded-2xl
            border-[3px]
            border-black
            bg-[#FFB703]
            text-lg
            font-black
            text-black
            shadow-[0_6px_0px_#000]
            transition-all
            duration-150
            hover:translate-y-[1px]
            hover:shadow-[0_5px_0px_#000]
            active:translate-y-[6px]
            active:shadow-none
          "
        >
          Join Campus 🚀
        </Button>


        <p className="text-center text-xs text-gray-400">
          🤫 Your real identity stays hidden
        </p>

      </div>

    </div>
  );
}