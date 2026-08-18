import { create } from "zustand";
import type { LoreStory } from "@/lib/types";

type LoreAction = "LORE_SHEET" | "LORE_FORM" | "NONE" | null;

type LoreStore = {

  selectedLore: LoreStory | null;
  setSelectedLore: (story: LoreStory | null) => void;

  action: LoreAction;
  setAction: (action: LoreAction) => void;
  
  clearLore: () => void;
};

export const useLoreStore = create<LoreStore>((set) => ({
  selectedLore: null,

  setSelectedLore: (story) => {
    set({
      selectedLore: story,
    });
  },

  action: null,
  setAction: (action) => {
    set({
      action,
    });
  },

  clearLore: () => {
    set({
      selectedLore: null,
      action: null,
    });
  },
}));