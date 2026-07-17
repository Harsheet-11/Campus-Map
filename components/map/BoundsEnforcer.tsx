"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { CAMPUS_BOUNDS } from "@/lib/campusBounds";

export default function BoundsEnforcer() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(
      [CAMPUS_BOUNDS.SW.lat, CAMPUS_BOUNDS.SW.lng],
      [CAMPUS_BOUNDS.NE.lat, CAMPUS_BOUNDS.NE.lng]
    );

    map.setMaxBounds(bounds);
    map.options.maxBoundsViscosity = 1.0;

    return () => {
      map.setMaxBounds(
        null as unknown as L.LatLngBoundsExpression
      );
    };
  }, [map]);

  return null;
}