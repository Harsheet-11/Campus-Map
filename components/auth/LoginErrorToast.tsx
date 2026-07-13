"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function LoginErrorToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (hasShownToast.current) return;

    const error = searchParams.get("error");
    if (!error) return;

    hasShownToast.current = true;

    switch (error) {
      case "wrong-account":
        toast.error(
          '😂 "Access denied, Confidence approved.\n Use your @nitrkl.ac.in ',
          {
            duration: 8000,
            position: "top-center",
            style: {
              background: "rgba(255,255,255,0.96)",
              color: "#0f172a",
              border: "1px solid rgba(226,232,240,0.9)",
              borderLeft: "5px solid #ef4444",
              borderRadius: "18px",
              padding: "18px 22px",
              width: "380px",
              maxWidth: "calc(100vw - 32px)",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "1.6",
              letterSpacing: "0.01em",
              whiteSpace: "pre-line",
              boxShadow: "0 20px 45px rgba(15,23,42,0.14)",
              backdropFilter: "blur(14px)",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        );
        break;

      default:
        toast.error("Something went wrong. Please try again.", {
          duration: 4000,
          position: "top-center",
        });
    }

    router.replace("/login", {
      scroll: false,
    });
  }, [searchParams, router]);

  return null;
}
