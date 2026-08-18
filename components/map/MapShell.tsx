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

import { useMapStore } from "@/stores/mapStore";
import MapFitter from "@/components/map/MapFitter";
import CinematicSequence from "@/components/map/CinematicSequence";
import ModeToggle from "@/components/map/ModeToggle";
import MapZoomTracker from "@/components/spots/MapZoomTracker";
import SpotManager from "@/components/spots/SpotManager";
import CardDialog from "../backgroundBlur/GeneralSpotDialog";
import LoreDialog from "@/components/backgroundBlur/LoreDialog";

import LoreModeOverlay from "@/components/spots/lore/LoreModeOverlay";
import LoreLayer from "../spots/lore/LoreLayer";

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
  // Zustand hooks must be here
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
    <div className="relative w-full h-screen overflow-hidden isolate">
      <div className="absolute inset-0">
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
            className={mode === "lore" ? "lore-tiles" : ""}
          />
          <LoreModeOverlay />
          <MapZoomTracker />
          <SpotManager />
          <LoreLayer />
          <MapFitter />
          {showCinematic && (
            <CinematicSequence onComplete={handleCinematicComplete} />
          )}
        </MapContainer>
      </div>
      <ModeToggle />
      <CardDialog/>
      <LoreDialog />
    </div>
  );
}
