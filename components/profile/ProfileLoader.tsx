// The arrived GET response from the users database, is used here to save those data from api into the LocalStorage

"use client";

import { useEffect } from "react";
import { useUserStore } from "@/components/stores/userStore";

export default function ProfileLoader() {
  const setUser      = useUserStore((state) => state.setUser);
  const user         = useUserStore((state) => state.user);
  const _hasHydrated = useUserStore((state) => state._hasHydrated);

  // Step 1 — trigger Zustand to rehydrate from localStorage
  // This runs once on mount, client-side only
  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);

  // Step 2 — only fetch from API after Zustand has hydrated
  // This prevents the server/client mismatch
  useEffect(() => {
    // not hydrated yet — wait
    if (!_hasHydrated) return;

    // user already in store from localStorage — skip fetch
    if (user) return;

    async function loadProfile() {
      const res = await fetch("/api/auth/complete-profile");

      // 401 = not logged in
      // 404 = no profile yet
      // both are expected — just means nothing to load
      if (!res.ok) return;

      const data = await res.json();
      setUser(data.user);
    }

    loadProfile();
  }, [_hasHydrated, user, setUser]);

  return null;
}