"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { NicknameCard } from "@/components/auth/NicknameCard";
import { onOnboardingTrigger } from "@/hooks/useOnboardingTrigger";


type OverlayState =
  | "visible"
  | "dismissing"
  | "hidden"
  | "expanding";


interface Props {
  defaultOpen?: boolean;
}


export function OnboardingOverlay({
  defaultOpen = true,
}: Props) {

  const [state, setState] =
    useState<OverlayState>(
      defaultOpen
        ? "visible"
        : "hidden"
    );


  const timerRef =
    useRef<NodeJS.Timeout | null>(null);



  // clear animations if component unmounts
  useEffect(() => {

    return () => {

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

    };

  }, []);



  const dismiss = useCallback(() => {

    if (state !== "visible") return;


    setState("dismissing");


    timerRef.current =
      setTimeout(() => {

        setState("hidden");

      }, 500);


  }, [state]);



  const expand = useCallback(() => {

    if (state !== "hidden") return;


    setState("expanding");


    timerRef.current =
      setTimeout(() => {

        setState("visible");

      }, 400);


  }, [state]);




  // open from external buttons
  useEffect(() => {
  const cleanup = onOnboardingTrigger(() => {
    setState((current) => {
      if (current === "hidden") {
        return "expanding";
      }

      return current;
    });

    setTimeout(() => {
      setState((current) => {
        if (current === "expanding") {
          return "visible";
        }

        return current;
      });
    }, 400);
  });

  return cleanup;
}, []);





  // ESC closes card
  useEffect(() => {


    const handleKey =
      (event: KeyboardEvent) => {

        if (event.key === "Escape") {
          dismiss();
        }

      };


    window.addEventListener(
      "keydown",
      handleKey
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKey
      );

    };


  }, [dismiss]);




  const cardVisible =
    state === "visible" ||
    state === "expanding";


  const cardDismissing =
    state === "dismissing";




  return (
    <>


      {/* Floating reopen button */}

      <button
        onClick={expand}
        aria-label="Set up your campus card"

        className="
          fixed top-4 right-4 z-50
          h-12 w-12
          rounded-full
          bg-orange-300
          border-[3px]
          border-[#1F2937]
          shadow-[3px_3px_0_#1F2937]
          flex items-center justify-center
          text-xl
          hover:scale-110
          active:scale-95
        "

        style={{
          opacity:
            state === "hidden"
              ? 1
              : 0,

          pointerEvents:
            state === "hidden"
              ? "auto"
              : "none",

          transform:
            state === "hidden"
              ? "scale(1)"
              : "scale(0.4)",

          transition:
            "opacity .3s ease, transform .3s ease",
        }}
      >

        <span
          className="
            absolute inset-0
            rounded-full
            border-2
            border-orange-400
            animate-ping
            opacity-60
          "
        />

        🗺️

      </button>





      {/* Overlay */}

      <div

        onClick={dismiss}

        className="
          fixed inset-0
          z-40
          flex items-center justify-center
          px-4
        "

        style={{

          background:
            "rgba(0,0,0,.35)",

          backdropFilter:
            "blur(4px)",


          opacity:
            cardVisible
              ? 1
              : 0,


          pointerEvents:
            cardVisible
              ? "auto"
              : "none",


          transition:
            "opacity .4s ease",

        }}

      >



        {/* Card animation wrapper */}

        <div

          onClick={(e) =>
            e.stopPropagation()
          }

          style={{


            transform:
              cardDismissing ||
              state === "expanding"

              ?

              "translate(calc(50vw - 2.5rem), calc(-50vh + 2.5rem)) scale(.05)"

              :

              "translate(0,0) scale(1)",



            opacity:
              cardDismissing
                ? 0
                : 1,



            transition:
              "transform .5s cubic-bezier(.4,0,.2,1), opacity .4s ease",



            transformOrigin:
              "center",


            width:
              "100%",


          }}

        >

          <NicknameCard
            onDismiss={dismiss}
          />


        </div>


      </div>





      {/* ESC message */}

      {
        state === "visible" && (

          <div

            className="
              fixed bottom-6
              left-1/2
              z-50
              -translate-x-1/2
              flex items-center gap-2
              rounded-full
              bg-black/30
              backdrop-blur-sm
              px-4 py-2
              text-xs
              text-white
              pointer-events-none
            "

          >

            <span>
              Click outside or press
            </span>


            <kbd
              className="
                rounded
                bg-white/20
                px-1.5 py-0.5
                font-mono
                text-[10px]
              "
            >
              ESC
            </kbd>


            <span>
              to set up later
            </span>


          </div>

        )
      }


    </>
  );
}