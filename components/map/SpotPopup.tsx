import type { PermanentSpot } from "@/lib/types";

interface Props {
  spot: PermanentSpot;
}

export default function SpotPopup({ spot }: Props) {
  return (
    <div className="min-w-[180px] max-w-[240px] p-1">
      <p className="font-black text-[#1F2937] text-sm leading-tight">
        {spot.name}
      </p>

      {spot.description && (
        <p className="mt-1 text-xs text-gray-600 leading-snug">
          {spot.description}
        </p>
      )}
    </div>
  );
}