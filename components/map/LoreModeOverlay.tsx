"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapStore } from "@/components/stores/mapStore";

export default function LoreModeOverlay() {
  const map = useMap();

  const mode = useMapStore((s) => s.mode);

  useEffect(() => {
    const tilePane = map.getPane("tilePane");

    if (!tilePane) return;

    if (mode === "lore") {
      tilePane.classList.add("lore-spooky");
    } else {
      tilePane.classList.remove("lore-spooky");
    }

    return () => {
      tilePane.classList.remove("lore-spooky");
    };
  }, [map, mode]);

  return null;
}
