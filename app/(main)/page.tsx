"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { NicknameCard } from "@/components/auth/NicknameCard";

export default function MapPage() {
  useEffect(() => {
    async function welcomeUser() {
      const shouldShow = sessionStorage.getItem("show-welcome-toast");

      if (!shouldShow) return;

      sessionStorage.removeItem("show-welcome-toast");

      toast.success(`Welcome Back 🎉`);
    }

    welcomeUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-white text-center p-8">
        <h1 className="text-2xl font-bold">NITR Campus Map</h1>
        <p className="text-slate-400 mt-2">Map coming in Phase 2</p>
        <NicknameCard  />
      </div>
    </div>
  );
}