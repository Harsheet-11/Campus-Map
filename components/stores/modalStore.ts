// It answers:
//      "Should I show the profile setup popup?"

// Stores whether the popup is open or closed. [ only for model dialog to show or not ]

import { create } from "zustand";

export type ModalType =
  | "profile-setup"
  | "profile-view"
  | "settings"
  | null;

type ModalStore = {
  modal: ModalType;
  open: (modal: Exclude<ModalType, null>) => void;
  close: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  modal: null,

  open: (modal) => set({ modal }),

  close: () => set({ modal: null }),
}));