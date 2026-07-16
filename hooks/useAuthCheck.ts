// I need 3 states:
//     1. User is not logged in
//     2. User is logged in but profile incomplete
//     3. User is logged in and profile complete

"use client";

// hooks/useAuthCheck.ts
"use client";

import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/components/stores/userStore";
import { useMemo } from "react";

export type AuthState =
  | { loggedIn: false;  hasProfile: false }
  | { loggedIn: true;   hasProfile: false }
  | { loggedIn: true;   hasProfile: true  };

export function useAuthCheck() {
  const supabase = useMemo(() => createClient(), []);
  const user     = useUserStore((state) => state.user);

  const check = async (): Promise<AuthState> => {
    // reads from browser cookie — zero network, zero DB
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { loggedIn: false, hasProfile: false };
    }
    const hasProfile = !!user;

    return { loggedIn: true, hasProfile };
  };

  return { check };
}