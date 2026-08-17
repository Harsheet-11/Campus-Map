import { create } from "zustand";
import type { LoreStory } from "@/lib/types";

type LoreAction = "LORE_SHEET" | "LORE_FORM" | "NONE" | null;

type LoreStore = {
  selectedLore: LoreStory | null;
  action: LoreAction;

  selectLore: (story: LoreStory) => void;
  openAction: (action: LoreAction) => void;
  clearLore: () => void;
};

export const useLoreStore = create<LoreStore>((set) => ({
  selectedLore: null,
  action: null,

  selectLore: (story) => {
    set({
      selectedLore: story,
    });
  },

  openAction: (action) => {
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