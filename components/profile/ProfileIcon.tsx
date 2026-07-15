"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { triggerOnboarding } from "@/hooks/useOnboardingTrigger";

export function ProfileIcon() {
  const [avatar,     setAvatar]     = useState<string | null>(null);
  const [nickname,   setNickname]   = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [loggedIn,   setLoggedIn]   = useState(false);
  const [showMenu,   setShowMenu]   = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      // reads from browser cookie — zero network, zero DB
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) return;

      setLoggedIn(true);

      const meta = session.user.user_metadata;

      if (meta?.profile_complete === true) {
        setHasProfile(true);
        setAvatar(meta.avatar   ?? "😎");
        setNickname(meta.nickname ?? null);
      }
    };

    load();
  }, []);

  const handleClick = () => {
    if (!loggedIn) return;

    if (!hasProfile) {
      // fire the signal — OnboardingOverlay listens for this
      // ProfileIcon never imports OnboardingOverlay
      triggerOnboarding();
      return;
    }

    // has profile → open menu (TBD)
    setShowMenu((prev) => !prev);
  };

  // not rendered for logged-out users
  if (!loggedIn) return null;

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={hasProfile ? "Open profile menu" : "Set up your profile"}
        title={nickname ?? "Set up your profile"}
        className="
          fixed top-4 right-4 z-30
          h-12 w-12 rounded-full
          border-[3px] border-[#1F2937]
          shadow-[3px_3px_0_#1F2937]
          flex items-center justify-center
          text-2xl
          transition hover:scale-105 active:scale-95
          overflow-hidden
        "
        style={{
          background: hasProfile ? "#FDE68A" : "#FED7AA",
        }}
      >
        {/* pulse ring while profile is incomplete */}
        {!hasProfile && (
          <span className="absolute inset-0 rounded-full border-2 border-orange-400 animate-ping opacity-50" />
        )}
        {avatar ?? "👤"}
      </button>

      {/* menu — TBD */}
      {showMenu && hasProfile && (
        <div className="fixed top-20 right-4 z-30 min-w-[160px] rounded-2xl bg-white border-[3px] border-[#1F2937] shadow-[4px_4px_0_#1F2937] p-4 text-sm font-bold text-gray-700">
          <p className="text-xs text-gray-400 mb-2">Signed in as</p>
          <p className="font-black text-gray-900">{avatar} {nickname}</p>
          <hr className="my-3 border-gray-100" />
          <p className="text-gray-400 text-xs">More options coming soon 👋</p>
        </div>
      )}
    </>
  );
}