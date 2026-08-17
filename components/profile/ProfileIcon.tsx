"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/components/stores/userStore";
import { useModalStore } from "@/components/stores/modalStore";
import LoginPopup from "@/components/spots/general/cards/LoginPopup";
import { createClient } from "@/lib/supabase/client";

export default function ProfileIcon() {
  const user = useUserStore((state) => state.user);
  const _hasHydrated = useUserStore((state) => state._hasHydrated);

  const open = useModalStore((state) => state.open);

  const [mounted, setMounted] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    useUserStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted || !_hasHydrated) return null;

  async function handleClick() {
    const supabase = createClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Case 1: Anonymous user
    if (!session) {
      setShowLoginPopup(true);
      return;
    }

    // Case 2: Logged in but profile not completed
    if (!user) {
      open("profile-setup");
      return;
    }

    // Case 3: Logged in + profile exists
    console.log("open profile menu");
  }

  return (
    <>
      <button
        onClick={handleClick}
        aria-label="Profile"
        className="
          fixed top-4 right-4 z-30
          h-12 w-12
          rounded-full
          bg-orange-200
          border-[3px]
          border-[#1F2937]
          shadow-[3px_3px_0_#1F2937]
          flex
          items-center
          justify-center
          text-2xl
          hover:scale-105
          active:scale-95
          transition-transform
          overflow-hidden
        "
      >
        {!user && (
          <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-50" />
        )}

        {user?.avatar ?? "👤"}
      </button>

      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}
    </>
  );
}
