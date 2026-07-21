"use client";

import { useState } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";

import type { PermanentSpot } from "@/lib/types";

import {
  buildSpotIconHtml,
  getCategoryVisual,
} from "@/components/map/SpotIcon";

import SpotPopup from "@/components/map/SpotPopup";

interface Props {
  spot: PermanentSpot;
}

export default function SpotMarker({ spot }: Props) {
  const [zoom, setZoom] = useState(16);

  // Listen for zoom changes
  useMapEvents({
    zoomend(event) {
      setZoom(event.target.getZoom());
    },

    load(event) {
      setZoom(event.target.getZoom());
    },
  });

  const visual = getCategoryVisual(spot.category);

  const showLabel = visual.showLabel && zoom >= visual.labelMinZoom;

  const icon = L.divIcon({
    html: buildSpotIconHtml(spot.icon.emoji, spot.name, spot.category, zoom),

    className: "",

    iconSize: showLabel ? [60, 65] : [40, 40],

    iconAnchor: showLabel ? [30, 65] : [20, 40],

    popupAnchor: [0, -45],
  });

  return (
    <Marker position={[spot.lat, spot.lng]} icon={icon}>
      <Popup className="spot-popup" closeButton={false} offset={[0, -8]}>
        <SpotPopup spot={spot} />
      </Popup>
    </Marker>
  );
}
