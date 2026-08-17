"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import type { LoreStory } from "@/lib/types";
import { useLoreStore } from "@/components/stores/loreStore";

interface Props {
  story: LoreStory;
}

const icon = L.divIcon({
  className: "",
  html: `<div style="font-size: 28px;">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 32],
});

export default function LoreMarker({ story }: Props) {
  console.log("LoreMarker received:", story);
  const selectLore = useLoreStore((s) => s.selectLore);
  const openAction = useLoreStore((s) => s.openAction);

  const handleClick = () => {
    selectLore(story);
    openAction("LORE_SHEET");
  };

  return (
    <Marker
      position={[story.lat, story.lng]}
      icon={icon}
      eventHandlers={{ click: handleClick }}
    />
  );
}
