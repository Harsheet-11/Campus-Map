interface Props {
  onClose: () => void;
}

export default function LoreCloseButton({
  onClose,
}: Props) {
  return (
    <div
      className="
        pointer-events-none

        absolute
        bottom-4
        left-0
        right-0

        z-40

        flex
        justify-center
      "
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close story"
        className="
          pointer-events-auto

          flex
          h-9
          w-9

          items-center
          justify-center

          rounded-full

          border
          border-[#6d2929]/20

          bg-[#e1dccd]/95

          text-[#51473a]
          text-[19px]
          font-light

          shadow-[0_4px_14px_rgba(40,25,10,0.16)]

          transition-all
          duration-200

          hover:scale-110
          hover:bg-[#6d2929]
          hover:text-white

          active:scale-95

          focus:outline-none
          focus:ring-2
          focus:ring-[#6d2929]/30
        "
      >
        ×
      </button>
    </div>
  );
}
