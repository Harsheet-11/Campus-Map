// Gets the logged-in user.
// Returns null if the user is not authenticated.

import { createServiceClient } from "@/lib/supabase/server";

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