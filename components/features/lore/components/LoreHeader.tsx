import type { LoreSpotFull } from "@/lib/types";

interface Props {
  story: LoreSpotFull;
}

export default function LoreHeader({ story }: Props) {
  return (
    <header
      className="
        relative
        z-10

        flex
        h-[30%]
        min-h-[170px]

        shrink-0
        flex-col
        items-center

        px-6
        pt-5
        sm:pt-6
      "
    >
      {/* =================================================
          ICON
      ================================================== */}
      <div
        className="
          relative
          flex
          h-[58px]
          w-[58px]
          shrink-0
          items-center
          justify-center

          sm:h-[62px]
          sm:w-[62px]
        "
      >
        {/* Glow */}
        <div
          className="
            absolute
            inset-[-6px]
            rounded-full
            bg-[#5c1e1e]/10
            blur-lg
          "
        />

        {/* Outer ring */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            border
            border-[#6d2929]/20
          "
        />

        {/* Inner ring */}
        <div
          className="
            absolute
            inset-[6px]
            rounded-full
            border
            border-dashed
            border-[#6d2929]/30
          "
        />

        {/* Icon */}
        <span
          className="
            lore-icon
            relative
            z-10
            select-none

            text-[2.35rem]
            leading-none

            sm:text-[2.5rem]
          "
          style={{
            filter: `
              drop-shadow(
                0 2px 3px rgba(0,0,0,0.30)
              )
              drop-shadow(
                0 0 8px rgba(80,15,15,0.25)
              )
            `,
          }}
          aria-hidden="true"
        >
          {story.icon}
        </span>
      </div>

      {/* =================================================
          TITLE
      ================================================== */}
      <h1
        className="
          mt-4

          max-w-[620px]

          px-4

          text-center

          text-[22px]
          leading-[1.25]

          font-semibold
          tracking-[-0.015em]

          text-[#211b14]

          sm:text-[25px]
        "
      >
        {story.title}
      </h1>

      {/* =================================================
          LOCATION
      ================================================== */}
      <div
        className="
          mt-2.5

          flex
          max-w-[90%]

          items-center
          justify-center
          gap-1.5

          text-center

          text-[12px]
          leading-[1.4]

          text-[#756b5b]
        "
      >
        <span
          className="
            shrink-0
            opacity-70
          "
          aria-hidden="true"
        >
          📍
        </span>

        <span
          className="
            underline
            decoration-dotted
            underline-offset-3
            decoration-[#756b5b]/35
          "
        >
          {story.location}
        </span>
      </div>

      {/* =================================================
          DIVIDER
      ================================================== */}
      <div
        className="
          mt-4

          flex
          w-full
          max-w-[500px]

          items-center
          gap-3
        "
      >
        <div className="h-px flex-1 bg-[#756b5b]/20" />

        <span
          className="
            select-none
            text-[8px]
            text-[#6d2929]/40
          "
        >
          ✦
        </span>

        <div className="h-px flex-1 bg-[#756b5b]/20" />
      </div>

      <style jsx>{`
        @keyframes lore-icon-float {
          0%,
          100% {
            transform: translateY(0) rotate(-3deg);
          }

          50% {
            transform: translateY(-3px) rotate(3deg);
          }
        }

        .lore-icon {
          animation:
            lore-icon-float
            4s
            ease-in-out
            infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .lore-icon {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
}
