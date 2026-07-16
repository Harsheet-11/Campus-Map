// decides when dialog opens

"use client";

import { useEffect } from "react";
import { useUserStore } from "@/components/stores/userStore";
import { useModalStore } from "@/components/stores/modalStore";
import { createClient } from "@/lib/supabase/client";

export default function ProfileSetupManager() {
  const user         = useUserStore((state) => state.user);
  const _hasHydrated = useUserStore((state) => state._hasHydrated);
  const open         = useModalStore((state) => state.open);

  useEffect(() => {
    // wait for Zustand to finish reading localStorage
    if (!_hasHydrated) return;

    async function check() {
      const supabase = createClient();

      // reads from browser cookie — zero DB, zero network
      const { data: { session } } = await supabase.auth.getSession();

      // not logged in → do nothing
      // LoginPopup handles this when user interacts
      if (!session) return;

      // logged in but no profile in store → open nickname card
      if (!user) {
        open("profile-setup");
      }
    }

    check();
  }, [_hasHydrated, user, open]);

  return null;
}