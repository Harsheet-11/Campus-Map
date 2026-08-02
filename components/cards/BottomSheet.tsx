import type { PermanentSpot } from "@/lib/types";

export default function BottomSheet({ spot }: { spot: PermanentSpot }) {
  return (
    <div
      className="
      absolute
      bottom-0
      left-0
      right-0
      z-[1000]
      bg-white
      rounded-t-3xl
      p-5
    "
    >
      <h2 className="font-bold text-xl">{spot.name}</h2>

      <p>{spot.description}</p>
    </div>
  );
}
