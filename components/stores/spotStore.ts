import { create } from "zustand";
import type { PermanentSpot } from "@/lib/types";

type SpotAction = "POPUP" | "MENU_CARD" | "COMP_FORM" | "NONE" | null;

type SpotStore = {
  selectedSpot: PermanentSpot | null;
  action: SpotAction;

  selectSpot: (spot: PermanentSpot) => void;
  openAction: (action: SpotAction) => void;

  clearSpot: () => void;
};

export const useSpotStore = create<SpotStore>((set) => ({
  selectedSpot: null,
  action: null,

  selectSpot: (spot) => {
    set({
      selectedSpot: spot,
    });
  },

  openAction: (action) => {
    set({
      action,
    });
  },

  clearSpot: () => {
    set({
      selectedSpot: null,
      action: null,
    });
  },
}));
