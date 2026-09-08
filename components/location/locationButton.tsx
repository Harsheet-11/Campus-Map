"use client";

export default function LocationButton() {
  return (
    <button
      aria-label="Find my location"
      title="Find me 👀"
      className="
        group fixed bottom-5 right-5 z-[9999]
        flex h-12 w-12 items-center justify-center
        rounded-full

        border-[3px] border-[#3b3155]
        bg-[#fff4d6]

        shadow-[0_4px_0_#3b3155,0_7px_16px_rgba(59,49,85,0.22)]

        transition-all duration-200
        hover:-translate-y-1
        hover:scale-110
        active:translate-y-[3px]
        active:scale-95
      "
    >
      {/* Magnifying glass */}
      <span
        className="
          relative
          h-[21px] w-[21px]
          transition-transform duration-300
          group-hover:rotate-[-8deg]
        "
      >
        <span
          className="
            absolute left-0 top-0
            h-[14px] w-[14px]
            rounded-full
            border-[3px] border-[#3b3155]
            bg-white
          "
        />

        <span
          className="
            absolute bottom-0 right-0
            h-[10px] w-[3px]
            rotate-[-45deg]
            rounded-full
            bg-[#3b3155]
          "
        />

        {/* You are here dot */}
        <span
          className="
            absolute left-[5px] top-[5px]
            h-1.5 w-1.5
            rounded-full
            bg-[#f43f5e]
            shadow-[0_0_5px_rgba(244,63,94,0.5)]
          "
        />
      </span>

      {/* tiny sparkle */}
      <span
        className="
          absolute right-1 top-1
          text-[9px] text-[#f4a261]
          opacity-80
          transition-transform duration-300
          group-hover:rotate-45
        "
      >
        ✦
      </span>
    </button>
  );
}
