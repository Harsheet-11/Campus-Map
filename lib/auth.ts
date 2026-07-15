import { createServiceClient } from "@/lib/supabase/server";

// Returns the authenticated user if a valid session exists.
// Returns null if no session or session is invalid.
// Used at the top of every protected API route.

export async function requireAuth() {
  const supabase = createServiceClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}