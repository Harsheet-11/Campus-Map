import { create } from "zustand";

export type MapMode   = "general" | "lore" | "fest";
export type SheetType = "canteen" | "chai" | null;

type MapStore = {

  // ── Mode 
  mode:       MapMode;
  setMode:    (mode: MapMode) => void;
  toggleMode: () => void;

  // ── Cinematic 
  hasDoneOpeningCinematic:    boolean;
  setHasDoneOpeningCinematic: (value: boolean) => void;

  // ── Active sheet 
  // sheetType    → which sheet is open right now
  // activeSpotId → which spot triggered it
  // isSheetOpen  → boolean guard consumed by MapFitter
  sheetType:    SheetType;
  activeSpotId: string | null;
  isSheetOpen:  boolean;
  openSheet:    (type: SheetType, spotId: string) => void;
  closeSheet:   () => void;
};

export const useMapStore = create<MapStore>((set, get) => ({

  // ── Mode 
  mode:    "general",
  setMode: (mode) => set({ mode }),
  toggleMode: () =>
    set({ mode: get().mode === "general" ? "lore" : "general" }),

  // ── Cinematic 
  hasDoneOpeningCinematic:    false,
  setHasDoneOpeningCinematic: (value) =>
    set({ hasDoneOpeningCinematic: value }),

  // ── Sheet 
  sheetType:    null,
  activeSpotId: null,
  isSheetOpen:  false,

  openSheet: (type, spotId) =>
    set({ sheetType: type, activeSpotId: spotId, isSheetOpen: true }),

  closeSheet: () =>
    set({ sheetType: null, activeSpotId: null, isSheetOpen: false }),
}));