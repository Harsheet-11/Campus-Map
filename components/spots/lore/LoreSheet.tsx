"use client";

import type { LoreStory } from "@/lib/types";

interface LoreSheetProps {
  story: LoreStory;
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