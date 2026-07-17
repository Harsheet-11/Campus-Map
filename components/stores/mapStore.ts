import { create } from "zustand";

export type MapMode = "general" | "lore";

type MapStore = {
  mode: MapMode;
  setMode:    (mode: MapMode) => void;
  toggleMode: () => void;

  hasDoneOpeningCinematic: boolean;
  setHasDoneOpeningCinematic: (value: boolean) => void;
};

export const useMapStore = create<MapStore>((set, get) => ({
  mode:       "general",
  setMode:    (mode) => set({ mode }),
  toggleMode: () =>
    set({ mode: get().mode === "general" ? "lore" : "general" }),

  hasDoneOpeningCinematic: false,
  setHasDoneOpeningCinematic: (value) =>
    set({ hasDoneOpeningCinematic: value }),
}));