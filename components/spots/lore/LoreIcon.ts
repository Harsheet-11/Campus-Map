import L from "leaflet";
import type { LoreSpot } from "@/lib/types";

export function createLoreIcon(spot: LoreSpot) {
  return L.divIcon({
    className: "",

    html: `
      <div class="lore-marker-boundary">
        <div class="spot-marker lore-marker">
          ${spot.icon}
        </div>
      </div>
    `,

    iconSize: [60, 60],
    iconAnchor: [30, 55],
  });
}
