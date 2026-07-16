"use client";

// import { useState } from "react";
// import LoginPopup from "@/components/auth/LoginPopup";
import  NicknameCard  from "@/components/auth/NicknameCard";
import ProfileIcon from "@/components/profile/ProfileIcon";
import ProfileLoader from "@/components/profile/ProfileLoader";


export default function MapPage() {
  // const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-white text-center p-8">
        <NicknameCard/>
        <ProfileIcon/>
        <ProfileLoader />
        {/* {showLogin && (
          <LoginPopup onClose={() => setShowLogin(false)} />
        )} */}
      </div>
    </div>
  );
}