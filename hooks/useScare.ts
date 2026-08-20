"use client";

import { useCallback, useRef } from "react";

import { useLoreStore } from "@/stores/loreSpotStore";
import { getScareAudio, stopScareAudio } from "@/hooks/scarePreloader";

const FIRST_SCARE_ALWAYS = true;
const SCARE_CHANCE = 0.3;
const COOLDOWN_MS = 3 * 60 * 1000;
const SCARE_DURATION_MS = 800;

let lastScareTime = 0;

export function useScare(jumpScaresEnabled: boolean) {
  const setScarePhase = useLoreStore((state) => state.setScarePhase);
  const setAction = useLoreStore((state) => state.setAction);

  const hasTriggeredFirstScare = useLoreStore(
    (state) => state.hasTriggeredFirstScare,
  );
  const setHasTriggeredFirstScare = useLoreStore(
    (state) => state.setHasTriggeredFirstScare,
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openLoreSheet = useCallback(() => {
    setAction("LORE_SHEET");
  }, [setAction]);

  const tryScareOrOpen = useCallback(() => {
    if (!jumpScaresEnabled) {
      openLoreSheet();
      return;
    }

    const isFirstScare =
      FIRST_SCARE_ALWAYS && !hasTriggeredFirstScare;

    if (!isFirstScare) {
      const now = Date.now();

      if (now - lastScareTime < COOLDOWN_MS) {
        openLoreSheet();
        return;
      }

      if (Math.random() >= SCARE_CHANCE) {
        openLoreSheet();
        return;
      }
    }

    lastScareTime = Date.now();
    setHasTriggeredFirstScare(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setScarePhase("SCARE");

    const audio = getScareAudio();

    void audio.play().catch(() => {
      // Audio may be blocked by the browser.
    });

    timeoutRef.current = setTimeout(() => {
      stopScareAudio();
      setScarePhase("ROAST");
      timeoutRef.current = null;
    }, SCARE_DURATION_MS);
  }, [
    jumpScaresEnabled,
    hasTriggeredFirstScare,
    openLoreSheet,
    setHasTriggeredFirstScare,
    setScarePhase,
  ]);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    stopScareAudio();
  }, []);

  return {
    tryScareOrOpen,
    cleanup,
  };
}
