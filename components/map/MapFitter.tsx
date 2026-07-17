"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { CAMPUS_BOUNDS } from "@/lib/campusBounds";

export default function MapFitter() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [
        CAMPUS_BOUNDS.SW.lat,
        CAMPUS_BOUNDS.SW.lng
      ],
      [
        CAMPUS_BOUNDS.NE.lat,
        CAMPUS_BOUNDS.NE.lng
      ]
    );

    const isMobile = window.innerWidth < 768;

    map.fitBounds(bounds, {
      padding: isMobile ? [-40, -40] : [0, 0],
      animate: false,
      
    });
  }, [map]);

  return null;
}