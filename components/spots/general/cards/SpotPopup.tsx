import type { PermanentSpot } from "@/lib/types";

export default function SpotPopup({ spot }: { spot: PermanentSpot }) {
  return (
    <div className="spot-card">
      <div className="spot-card-arrow" />

      <div className="spot-card-header">
        <span className="spot-card-icon">
          {spot.icon?.emoji ?? "📍"}
        </span>

        <h3>{spot.name}</h3>
      </div>

      {spot.description && <p>{spot.description}</p>}
    </div>
  );
}