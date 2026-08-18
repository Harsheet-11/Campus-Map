"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";

import type { PermanentSpot } from "@/lib/types";
import { createSpotIcon } from "@/components/spots/general/SpotIcon";
import SpotPopup from "@/components/spots/general/cards/SpotPopup";
import { useGeneralSpotStore } from "@/stores/generalSpotStore";

export default function SpotMarker({ spot }: { spot: PermanentSpot }) {
  
  const icon = useMemo(() => createSpotIcon(spot), [spot.id]);

  const setSelectedSpot = useGeneralSpotStore((state) => state.setSelectedSpot);

  const setAction = useGeneralSpotStore((state) => state.setAction);

  function handleClick() {

    setSelectedSpot(spot);

    switch (spot.click_action) {
      case "MENU_CARD":
        setAction("MENU_CARD");
        break;

      case "COMP_FORM":
        setAction("COMP_FORM");
        break;

      case "POPUP":
        setAction(null);
        break;

      case "NONE":
        setAction(null);
        break;
    }
  }

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={icon}
      eventHandlers={{ click: handleClick}}
    >
      {spot.click_action === "POPUP" && (
        <Popup className="spot-popup" closeButton={false}>
          <SpotPopup spot={spot} />
        </Popup>
      )}
    </Marker>
  );
}
