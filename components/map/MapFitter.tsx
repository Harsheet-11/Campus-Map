"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { CAMPUS_BOUNDS } from "@/lib/campusBounds";
import { useMapStore }   from "@/components/stores/mapStore";

export default function MapFitter() {
  const map = useMap();
  const isSheetOpen = useMapStore((s) => s.isSheetOpen);

  useEffect(() => {
    const fitMap = () => {
      if (isSheetOpen) return;
      const bounds = L.latLngBounds(
        [CAMPUS_BOUNDS.SW.lat, CAMPUS_BOUNDS.SW.lng],
        [CAMPUS_BOUNDS.NE.lat, CAMPUS_BOUNDS.NE.lng]
      );

      const isMobile = window.innerWidth < 768;

      map.fitBounds(bounds, {
        animate: false,
        padding: isMobile ? [20, 20] : [0, 0],
        maxZoom: isMobile ? 17 : 19,
      });

      if (!isMobile) {
        map.setZoom(map.getZoom() + 1);
      }
    };

    fitMap();
    window.addEventListener("resize", fitMap);

    return () => {
      window.removeEventListener("resize", fitMap);
    };
  }, [map, isSheetOpen]);

  return null;
}