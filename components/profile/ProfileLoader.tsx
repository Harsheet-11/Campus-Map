"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

export default function ProfileLoader() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const hasHydrated = useUserStore((state) => state._hasHydrated);

  // Get saved user data from localStorage.
  useEffect(() => {
    useUserStore.persist.rehydrate();
  }, []);

  // Get user data from the API if no saved user exists.
  useEffect(() => {
    if (!hasHydrated || user) return;

    const loadUser = async () => {
      const response = await fetch("/api/auth/complete-profile");

      // No user/profile found, so nothing to do.
      if (!response.ok) return;

      const data = await response.json();
      setUser(data.user);
    };

    loadUser();
  }, [hasHydrated, user, setUser]);

  return null;
}
