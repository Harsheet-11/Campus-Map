"use client";

import AppDialog from "@/components/bgDialog/AppDialog";
import ProfileIcon from "@/components/profile/ProfileIcon";
import ProfileLoader from "@/components/profile/ProfileLoader";
import ProfileSetupManager from "@/components/profile/ProfileSetupManager";

import dynamic from "next/dynamic";

const MapShell = dynamic(
  () => import("@/components/map/MapShell"),

  {
    ssr: false,

    loading: () => (
      <div className="w-full h-screen bg-[#F8EFD9] flex items-center justify-center">
        <span className="text-4xl animate-bounce">🗺️</span>
      </div>
    ),
  },
);

export default function MainApp() {
  return (
    <>
      <MapShell />
      <ProfileLoader />
      <ProfileSetupManager />
      <AppDialog />
      <ProfileIcon />
    </>
  );
}
