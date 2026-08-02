import type { PermanentSpot } from "@/lib/types";

export default function CompForm({ spot }: { spot: PermanentSpot }) {
  return (
    <div
      className="
      absolute
      inset-0
      z-[1000]
      bg-white
      p-5
    "
    >
      <h2 className="font-bold">Submit something for {spot.name}</h2>

      <input className="border p-2 mt-4" placeholder="Your submission" />
    </div>
  );
}
