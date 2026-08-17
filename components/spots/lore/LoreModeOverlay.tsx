"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapStore } from "@/components/stores/mapStore";

export default function LoreModeOverlay() {
  const map = useMap();
  const mode = useMapStore((s) => s.mode);

  useEffect(() => {
    const mapContainer = map.getContainer();
    const tilePane = map.getPane("tilePane");

    if (!tilePane) return;

    let atmosphere = mapContainer.querySelector(
      ".lore-atmosphere",
    ) as HTMLDivElement | null;

    if (mode === "lore") {
      tilePane.classList.add("lore-spooky");

      if (!atmosphere) {
        atmosphere = document.createElement("div");
        atmosphere.className = "lore-atmosphere";

        atmosphere.innerHTML = `
          <div class="lore-vignette"></div>
          <div class="lore-mist lore-mist-one"></div>
          <div class="lore-mist lore-mist-two"></div>
          <div class="lore-flicker"></div>
        `;

        mapContainer.appendChild(atmosphere);
      }

      requestAnimationFrame(() => {
        atmosphere?.classList.add("lore-active");
      });
    } else {
      tilePane.classList.remove("lore-spooky");

      if (atmosphere) {
        atmosphere.classList.remove("lore-active");

        setTimeout(() => {
          atmosphere?.remove();
        }, 1000);
      }
    }

    return () => {
      tilePane.classList.remove("lore-spooky");
    };
  }, [map, mode]);

  return (
    <style>{`
      .lore-spooky {
        animation: lore-map-pulse 7s ease-in-out infinite;
      }

      .lore-atmosphere {
  position: absolute;
  inset: 0;
  z-index: 350;
  pointer-events: none;
  overflow: hidden;
  opacity: 0;
  transition: opacity 1s ease;
}

      .lore-atmosphere.lore-active {
        opacity: 1;
      }

      .lore-vignette {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      ellipse at center,
      rgba(20, 0, 35, 0.04) 0%,
      rgba(10, 0, 25, 0.22) 45%,
      rgba(3, 0, 10, 0.65) 100%
    );

  animation: lore-vignette-pulse 6s ease-in-out infinite;
}

      .lore-mist {
        position: absolute;

        width: 70%;
        height: 45%;

        border-radius: 50%;

        filter: blur(45px);

        opacity: 0.12;

        background:
          radial-gradient(
            ellipse,
            rgba(150, 100, 180, 0.8) 0%,
            rgba(70, 30, 100, 0.35) 40%,
            transparent 75%
          );
      }

      .lore-mist-one {
        top: 10%;
        left: -20%;

        animation:
          lore-mist-one 18s ease-in-out infinite alternate;
      }

      .lore-mist-two {
        bottom: 0;
        right: -25%;

        opacity: 0.09;

        animation:
          lore-mist-two 23s ease-in-out infinite alternate;
      }

      .lore-flicker {
        position: absolute;
        inset: 0;

        background: rgba(80, 30, 100, 0.025);

        animation: lore-flicker 9s ease-in-out infinite;
      }

      @keyframes lore-map-pulse {
        0%,
        100% {
          filter:
            saturate(0.25)
            brightness(0.7)
            contrast(1.08)
            sepia(0.12);
        }

        50% {
          filter:
            saturate(0.16)
            brightness(0.58)
            contrast(1.15)
            sepia(0.2);
        }
      }

      @keyframes lore-vignette-pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 0.85;
        }

        50% {
          transform: scale(1.04);
          opacity: 1;
        }
      }

      @keyframes lore-mist-one {
        0% {
          transform: translate3d(-20%, 10%, 0) scale(0.9);
        }

        50% {
          transform: translate3d(20%, -5%, 0) scale(1.2);
        }

        100% {
          transform: translate3d(45%, 15%, 0) scale(1.05);
        }
      }

      @keyframes lore-mist-two {
        0% {
          transform: translate3d(20%, 10%, 0) scale(1);
        }

        50% {
          transform: translate3d(-20%, -15%, 0) scale(1.25);
        }

        100% {
          transform: translate3d(-45%, 5%, 0) scale(1.05);
        }
      }

      @keyframes lore-flicker {
        0%,
        100% {
          opacity: 0;
        }

        48% {
          opacity: 0;
        }

        49% {
          opacity: 0.8;
        }

        50% {
          opacity: 0.15;
        }

        51% {
          opacity: 0.5;
        }

        52% {
          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .lore-spooky,
        .lore-vignette,
        .lore-mist-one,
        .lore-mist-two,
        .lore-flicker {
          animation: none;
        }
      }
    `}</style>
  );
}
