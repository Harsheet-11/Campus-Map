"use client";

import { useState } from "react";
import type { PermanentSpot } from "@/lib/types";
import MenuHeader from "./MenuHeader";
import DishesTab from "./DishesTab";
import SuggestTab from "./SuggestTab";
import LoginPopup from "@/components/features/general/components/LoginPopup";

export default function MenuCard({
  spot,
  onClose,
}: {
  spot: PermanentSpot;
  onClose?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"dishes" | "suggest">("dishes");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleLoginRequired = () => {
    setShowLoginPopup(true);
  };

  const handleLoginPopupClose = () => {
    setShowLoginPopup(false);
  };

  // Login popup is shown instead of the menu
  if (showLoginPopup) {
    return <LoginPopup onClose={handleLoginPopupClose} />;
  }

  return (
    <div className="relative bg-white rounded-[28px] shadow-2xl overflow-hidden w-[85vw] max-w-[360px] aspect-[9/16] flex flex-col font-sans">
      
      {/* HEADER */}
      <MenuHeader spot={spot} onClose={onClose} />

      {/* TABS */}
      <div className="flex-shrink-0 px-4 pt-1 pb-3">
        <div className="flex gap-2 bg-gray-50 rounded-full p-1">
          <button
            onClick={() => setActiveTab("dishes")}
            className={`flex-1 py-2 text-[13px] font-extrabold rounded-full transition-all ${
              activeTab === "dishes"
                ? "bg-[#FFCC33] text-gray-900 shadow-sm"
                : "bg-transparent text-gray-500"
            }`}
          >
            Top Dishes
          </button>

          <button
            onClick={() => setActiveTab("suggest")}
            className={`flex-1 py-2 text-[13px] font-extrabold rounded-full transition-all ${
              activeTab === "suggest"
                ? "bg-[#FFCC33] text-gray-900 shadow-sm"
                : "bg-transparent text-gray-500"
            }`}
          >
            Suggest a Dish
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-h-0 flex flex-col px-4 pb-4">
        {activeTab === "dishes" ? (
          <DishesTab
            canteenId={spot.id}
            onLoginRequired={handleLoginRequired}
          />
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <SuggestTab canteenId={spot.id} />
          </div>
        )}
      </div>
    </div>
  );
}
