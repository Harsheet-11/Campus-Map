"use client";

import { useEffect, useMemo } from "react";
import { Marker } from "react-leaflet";

import { createLoreIcon } from "@/components/features/lore/LoreIcon";
import { useScare } from "@/hooks/useScare";
import type { LoreSpot } from "@/lib/types";
import { useLoreStore } from "@/stores/loreSpotStore";

interface Props {
  spot: LoreSpot;
  jumpScaresEnabled: boolean;
}

export default function LoreMarker({ spot, jumpScaresEnabled }: Props) {
  const icon = useMemo(() => createLoreIcon(spot), [spot]);

  const setSelectedLore = useLoreStore((state) => state.setSelectedLore);
  const { tryScareOrOpen, cleanup } = useScare(jumpScaresEnabled);

  useEffect(() => cleanup, [cleanup]);

  // Select the story, then trigger the scare or lore sheet.
  const handleClick = () => {
    setSelectedLore(spot);
    tryScareOrOpen();
  };

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={icon}
      eventHandlers={{ click: handleClick }}
    />
  );
}
