import { create } from "zustand";
import type { LoreSpotFull } from "@/lib/types";

export type LoreAction = "LORE_SHEET" | "LORE_FORM" | null;

export type ScarePhase = "SCARE" | "ROAST" | null;

interface LoreStore {
  selectedLore: LoreSpotFull | null;
  action: LoreAction;

  scarePhase: ScarePhase;
  hasTriggeredFirstScare: boolean;

  setSelectedLore: (spot: LoreSpotFull | null) => void;
  setAction: (action: LoreAction) => void;

  setScarePhase: (phase: ScarePhase) => void;
  setHasTriggeredFirstScare: (value: boolean) => void;

  clearLore: () => void;
}

export const useLoreStore = create<LoreStore>((set) => ({
  selectedLore: null,
  action: null,

  scarePhase: null,
  hasTriggeredFirstScare: false,

  setSelectedLore: (spot) =>
    set({
      selectedLore: spot,
    }),

  setAction: (action) =>
    set({
      action,
    }),

  setScarePhase: (phase) =>
    set({
      scarePhase: phase,
    }),

  setHasTriggeredFirstScare: (value) =>
    set({
      hasTriggeredFirstScare: value,
    }),

  clearLore: () =>
    set({
      selectedLore: null,
      action: null,
      scarePhase: null,
    }),
}));
