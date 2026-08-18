import { create } from "zustand";
import type { PermanentSpot, SpotAction } from "@/lib/types";

type GeneralSpotStore = {

  selectedSpot: PermanentSpot | null;
  setSelectedSpot: (spot: PermanentSpot | null) => void;

  action: SpotAction;
  setAction: (action: SpotAction) => void;

  clearSpot: () => void;
};

export const useGeneralSpotStore = create<GeneralSpotStore>((set) => ({

  selectedSpot: null,
  setSelectedSpot: (spot: PermanentSpot | null) => {
    set({
      selectedSpot: spot,
    });
  },

  action: null,
  setAction: (action) => {
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
