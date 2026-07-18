"use client";

import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  CAMPUS_BOUNDS,
  CAMPUS_CENTER,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
} from "@/lib/campusBounds";

import { useMapStore } from "@/components/stores/mapStore";
// import BoundsEnforcer        from "@/components/map/BoundsEnforcer";
import MapFitter from "@/components/map/MapFitter";
import CinematicSequence from "@/components/map/CinematicSequence";
import ModeToggle from "@/components/map/ModeToggle";
import LoreModeOverlay from "@/components/map/LoreModeOverlay";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CINEMATIC_KEY = "nitr-cinematic-done";

export default function MapShell() {
  const [mounted, setMounted] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);
  const mode = useMapStore((s) => s.mode);

  useEffect(() => {
    const done = localStorage.getItem(CINEMATIC_KEY) === "true";
    setShowCinematic(!done);
    setMounted(true);
  }, []);

  const handleCinematicComplete = useCallback(() => {
    setShowCinematic(false);
  }, []);

  if (!mounted) return null;

  const maxBounds = L.latLngBounds(
    [CAMPUS_BOUNDS.SW.lat, CAMPUS_BOUNDS.SW.lng],
    [CAMPUS_BOUNDS.NE.lat, CAMPUS_BOUNDS.NE.lng],
  );

  return (
    <div
      className="relative w-full h-screen overflow-hidden isolate"
      style={{
        filter: mode === "lore" ? "saturate(0.3) brightness(0.7)" : "none",
        transition: "filter 1500ms ease",
      }}
    >
      <MapContainer
        center={[CAMPUS_CENTER.lat, CAMPUS_CENTER.lng]}
        zoom={showCinematic ? MIN_ZOOM : DEFAULT_ZOOM}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        zoomControl={true}
        attributionControl={false}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="/tiles/{z}/{x}/{y}.png"
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          errorTileUrl="/error-tile.png"
          attribution=""
        />
        {/* <BoundsEnforcer /> */}
        <MapFitter />
        {showCinematic && (
          <CinematicSequence onComplete={handleCinematicComplete} />
        )}
      </MapContainer>
      <LoreModeOverlay />
      <ModeToggle />
    </div>
  );
}
