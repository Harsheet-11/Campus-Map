import type { SpotCategory } from "@/lib/types";

interface CategoryVisualConfig {
  animationClass: string;
  emojiSize: string;
  showLabel: boolean;
  labelMinZoom: number;
}

const DEFAULT_VISUAL: CategoryVisualConfig = {
  animationClass: "spot-emoji--pulse",
  emojiSize: "22px",
  showLabel: false,
  labelMinZoom: 99,
};

const CATEGORY_VISUALS: Partial<Record<SpotCategory, CategoryVisualConfig>> = {
  CANTEEN: {
    animationClass: "spot-emoji--steam",
    emojiSize: "28px",
    showLabel: true,
    labelMinZoom: 16,
  },
  CHAI: {
    animationClass: "spot-emoji--bob",
    emojiSize: "24px",
    showLabel: false,
    labelMinZoom: 99,
  },
  HANGOUT: {
    animationClass: "spot-emoji--pulse",
    emojiSize: "24px",
    showLabel: false,
    labelMinZoom: 99,
  },
  LANDMARK: {
    animationClass: "spot-emoji--none",
    emojiSize: "26px",
    showLabel: true,
    labelMinZoom: 16,
  },
};

export function getCategoryVisual(
  category: SpotCategory,
): CategoryVisualConfig {
  return CATEGORY_VISUALS[category] ?? DEFAULT_VISUAL;
}

export function buildSpotIconHtml(
  emoji: string,
  name: string,
  category: SpotCategory,
  zoom: number,
  delay: number = 0,
): string {
  const config = getCategoryVisual(category);
  const showLabel = config.showLabel && zoom >= config.labelMinZoom;

  const delayStyle = delay > 0 ? `animation-delay: ${delay}s;` : "";

  return `
    <div class="spot-icon-wrapper">
      <div
        class="spot-emoji ${config.animationClass}"
        style="font-size: ${config.emojiSize}; ${delayStyle}"
      >
        ${emoji}
      </div>
      ${showLabel ? `<div class="spot-label">${name}</div>` : ""}
    </div>
  `;
}

export interface IconDimensions {
  iconSize: [number, number];
  iconAnchor: [number, number];
  popupAnchor: [number, number];
}

export function getIconDimensions(
  category: SpotCategory,
  showLabel: boolean,
): IconDimensions {
  if (category === "CANTEEN") {
    return showLabel
      ? { iconSize: [40, 58], iconAnchor: [20, 58], popupAnchor: [0, -60] }
      : { iconSize: [40, 36], iconAnchor: [20, 36], popupAnchor: [0, -38] };
  }

  // Chai
  if (category === "CHAI") {
    return { iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -34] };
  }

  // Default for all other categories
  return { iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -34] };
}
