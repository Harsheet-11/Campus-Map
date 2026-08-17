// Store MAP mode, Zoom Levels, Cinematic Overlay

import { create } from "zustand";

export type MapMode = "general" | "lore" | "fest";
export type SheetType = "canteen" | "chai" | null;

type MapStore = {
  // ── Mode
  mode: MapMode;
  setMode: (mode: MapMode) => void;
  toggleMode: () => void;

  // ── Zoom
  zoom: number;
  setZoom: (zoom: number) => void;

  // ── Sheet
  sheet: SheetType;
  setSheet: (sheet: SheetType) => void;

  // ── Cinematic
  hasDoneOpeningCinematic: boolean;
  setHasDoneOpeningCinematic: (value: boolean) => void;
};

export const useMapStore = create<MapStore>((set, get) => ({
  // ── Mode
  mode: "general",

  setMode: (mode) => set({ mode }),

  toggleMode: () =>
    set({
      mode: get().mode === "general" ? "lore" : "general",
    }),

  // ── Zoom
  zoom: 16,

  setZoom: (zoom) => set({ zoom }),

  // ── Sheet
  sheet: null,

  setSheet: (sheet) => set({ sheet }),

  // ── Cinematic
  hasDoneOpeningCinematic: false,

  setHasDoneOpeningCinematic: (value) =>
    set({ hasDoneOpeningCinematic: value }),
}));
