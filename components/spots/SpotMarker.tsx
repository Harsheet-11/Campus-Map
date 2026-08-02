"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";

import type { PermanentSpot } from "@/lib/types";

import { createSpotIcon } from "@/components/spots/SpotIcon";
import SpotPopup from "@/components/cards/SpotPopup";

import { useSpotStore } from "@/components/stores/spotStore";

export default function SpotMarker({ spot }: { spot: PermanentSpot }) {
  const icon = useMemo(() => createSpotIcon(spot), [spot.id]);

  const selectSpot = useSpotStore((state) => state.selectSpot);

  const openAction = useSpotStore((state) => state.openAction);

  function handleClick() {

    selectSpot(spot);

    switch (spot.click_action) {
      case "BOTTOM_SHEET":
        openAction("BOTTOM_SHEET");
        break;

      case "COMP_FORM":
        openAction("COMP_FORM");
        break;

      case "POPUP":
        openAction(null);
        break;

      case "NONE":
        openAction(null);
        break;
    }
  }

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      {spot.click_action === "POPUP" && (
        <Popup className="spot-popup" closeButton={false}>
          <SpotPopup spot={spot} />
        </Popup>
      )}
    </Marker>
  );
}
