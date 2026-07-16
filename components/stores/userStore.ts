// It answers:
//      "Does this user have a profile?"

// Stores who the user is.

import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  npc_name: string;
  avatar: string;
  hasProfile: boolean;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,

      setUser: (user) => set({ user }),

      logout: () => set({ user: null }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "user",

      // do not read localStorage on the server
      // only rehydrate after the component mounts on the client
      skipHydration: true,

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);