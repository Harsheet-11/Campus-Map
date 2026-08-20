import type { LoreSpotFull } from "@/lib/types";

interface Props {
  story: LoreSpotFull;
}

export default function LoreContent({ story }: Props) {
  const paragraphs = story.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main
      className="
        lore-content-scroll

        absolute
        inset-x-0
        top-[30%]
        bottom-0

        z-10

        overflow-y-auto
        overflow-x-hidden

        px-6
        pb-28
        pt-3

        sm:px-10
        sm:pt-5
      "
    >
      <article
        className="
          mx-auto
          w-full
          max-w-[640px]

          break-words

          text-[#393329]

          text-[17px]
          leading-[1.6]

          sm:text-[18px]
          sm:leading-[1.65]
        "
      >
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="
              mb-6
              last:mb-0

              [&:has(>strong)]:mb-7
            "
          >
            {paragraph}
          </p>
        ))}

        {/* END OF STORY */}
        <div
          className="
            mt-12
            flex
            items-center
            justify-center
            gap-4
            pb-5
          "
        >
          <div className="h-px w-12 bg-[#756b5b]/20" />

          <span className="text-[11px] text-[#756b5b]/45">
            {story.icon}
          </span>

          <div className="h-px w-12 bg-[#756b5b]/20" />
        </div>
      </article>

      <style jsx>{`
        .lore-content-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }

        .lore-content-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </main>
  );
}
