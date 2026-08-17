import L from "leaflet";
import type { PermanentSpot } from "@/lib/types";

export function createSpotIcon(spot: PermanentSpot) {
  const html = buildSpotHTML(spot);

  return L.divIcon({
    className: "",

    html,

    iconSize: getIconSize(spot),

    iconAnchor: getIconAnchor(spot),
  });
}

function buildSpotHTML(spot: PermanentSpot) {
  const emoji = spot.icon?.emoji ?? getSpotEmoji(spot.category);

  switch (spot.display_type) {
    case "LABEL":
      return `
        <div class="spot-marker spot-label-marker">
          ${spot.slang}
        </div>
      `;

    case "BOTH":
      return `
        <div class="spot-marker spot-both">

          <div class="spot-emoji">
            ${emoji}
          </div>

          <div class="spot-label">
            ${spot.name}
          </div>

        </div>
      `;

    case "ICON":

    default:
      return `
        <div class="spot-marker">

          ${emoji}

        </div>
      `;
  }
}

function getIconSize(spot: PermanentSpot): [number, number] {
  if (spot.display_type === "LABEL") {
    return [150, 40];
  }

  if (spot.display_type === "BOTH") {
    return [100, 100];
  }

  return [60, 60];
}

function getIconAnchor(spot: PermanentSpot): [number, number] {
  if (spot.display_type === "LABEL") {
    return [75, 20];
  }

  if (spot.display_type === "BOTH") {
    return [50, 70];
  }

  return [30, 55];
}

function getSpotEmoji(category: string) {
  switch (category) {
    case "CANTEEN":
      return "🍔";

    case "CHAI":
      return "☕";

    case "FACILITY":
      return "🏥";

    case "ACADEMIC":
      return "🎓";

    case "HOSTEL":
      return "🏠";

    default:
      return "📍";
  }
}
