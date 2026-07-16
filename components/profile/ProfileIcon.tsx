"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/components/stores/userStore";
import { useModalStore } from "@/components/stores/modalStore";

export default function ProfileIcon() {
  const user         = useUserStore((state) => state.user);
  const _hasHydrated = useUserStore((state) => state._hasHydrated);
  const open         = useModalStore((state) => state.open);

  // local mounted state prevents any render before hydration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useUserStore.persist.rehydrate();
    setMounted(true);
  }, []);

  // render nothing until Zustand has hydrated from localStorage
  // this prevents the server/client HTML mismatch
  if (!mounted || !_hasHydrated) return null;

  function handleClick() {
    if (!user) {
      open("profile-setup");
      return;
    }

    // has profile → open menu (TBD)
  }

  return (
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
      {/* pulse ring when no profile */}
      {!user && (
        <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-50" />
      )}

      {user?.avatar ?? "👤"}
    </button>
  );
}