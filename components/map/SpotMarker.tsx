"use client";

import { Marker, Popup } from "react-leaflet";
import type { PermanentSpot } from "@/lib/types";

interface Props {
  spot: PermanentSpot;
}

export default function SpotMarker({ spot }: Props) {
  return (
    <Marker position={[spot.lat, spot.lng]}>
      <Popup>
        <div>
          <strong>{spot.name}</strong>
          <br />
          Latitude: {spot.lat}
          <br />
          Longitude: {spot.lng}
        </div>
      </Popup>
    </Marker>
  );
}