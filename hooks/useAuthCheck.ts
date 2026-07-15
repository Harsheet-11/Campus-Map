// I need 3 states:
//     1. User is not logged in
//     2. User is logged in but profile incomplete
//     3. User is logged in and profile complete

"use client";

import { createClient } from "@/lib/supabase/client";
import { useMemo } from "react";

export type AuthState =
  | { loggedIn: false; hasProfile: false }
  | { loggedIn: true; hasProfile: false }
  | { loggedIn: true; hasProfile: true };

export function useAuthCheck() {
   const supabase = useMemo(() => createClient(), []);

  const check = async (): Promise<AuthState> => {
    // Get current session
    const response = await supabase.auth.getSession();
    let session = response.data.session;

    // No session = user is not logged in
    if (!session) {
      return {
        loggedIn: false,
        hasProfile: false,
      };
    }

    // Refresh session to get latest metadata
    const refreshResponse = await supabase.auth.refreshSession();
    const refreshedSession = refreshResponse.data.session;

    if (refreshedSession) {
      session = refreshedSession;
    }

    // Check profile completion from Supabase user metadata
    const hasProfile =
      session.user.user_metadata?.profile_complete === true;

    return {
      loggedIn: true,
      hasProfile,
    };
  };

  return { check };
} 