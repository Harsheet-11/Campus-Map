"use client";

import type { LoreSpot } from "@/lib/types";

interface LoreSheetProps {
  story: LoreSpot;
  onClose: () => void;
}

export default function LoreSheet({
  story,
  onClose,
}: LoreSheetProps) {
  return (
    <div>
      <button onClick={onClose}>Close</button>

      <h2>{story.title}</h2>
    </div>
  );
}