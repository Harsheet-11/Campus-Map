"use client";

import { useMapStore } from "@/components/stores/mapStore";
import { useMapEvents } from "react-leaflet";

export default function MapZoomTracker() {

    const setZoom = useMapStore((state) => state.setZoom)

    useMapEvents({
        zoomend(event) {
            const zoom = event.target.getZoom();
            setZoom(zoom);
        }
    })
    return null
}