"use client";

import { useMemo } from "react";
import { Marker } from "react-leaflet";

import { createLoreIcon } from "@/components/spots/lore/LoreIcon";
import type { LoreSpot } from "@/lib/types";
import { useLoreStore } from "@/stores/loreSpotStore";

interface Props {
  spot: LoreSpot;
}

export default function LoreMarker({ spot }: Props) {
  const icon = useMemo(
    () => createLoreIcon(spot),
    [spot]
  );

  const setSelectedLore = useLoreStore(
    (s) => s.setSelectedLore
  );

  const setAction = useLoreStore(
    (s) => s.setAction
  );

  const handleClick = () => {
    setSelectedLore(spot);
    setAction("LORE_SHEET");
  };

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    />
  );
}
