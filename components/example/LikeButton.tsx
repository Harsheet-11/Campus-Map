// example: components/LikeButton.tsx
"use client";

import { useState } from "react";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import LoginPopup from "@/components/auth/LoginPopup";

export function LikeButton() {
  const { check }      = useAuthCheck();
  const [popup, setPopup] = useState(false);

  const handleClick = async () => {
    const state = await check();

    // not logged in → show login popup
    if (!state.loggedIn) {
      setPopup(true);
      return;
    }

    // logged in but no profile → OnboardingOverlay
    // already mounted on the page via app/page.tsx
    // ProfileIcon handles opening it
    if (!state.hasProfile) return;

    // ✅ logged in + has profile → do the action
    console.log("liked");
  };

  return (
    <>
      <button onClick={handleClick}>❤️ Like</button>
      {popup && <LoginPopup onClose={() => setPopup(false)} />}
    </>
  );
}