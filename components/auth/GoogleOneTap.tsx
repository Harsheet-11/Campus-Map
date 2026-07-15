"use client";

import { useMemo } from "react";
import toast from "react-hot-toast";
import type { accounts, CredentialResponse } from "google-one-tap";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

declare const google: { accounts: accounts };

// Generate nonce for secure Google ID token verification
const generateNonce = async (): Promise<[string, string]> => {
  if (!window.crypto?.subtle) {
    throw new Error("Web Crypto API is not available");
  }

  const nonce = btoa(
    String.fromCharCode(
      ...window.crypto.getRandomValues(new Uint8Array(32)),
    ),
  );

  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);

  const hashBuffer = await window.crypto.subtle.digest(
    "SHA-256",
    encodedNonce,
  );

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashedNonce = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return [nonce, hashedNonce];
};

export default function GoogleOneTap() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const initializeGoogleOneTap = async () => {
    try {
      // Don't show One Tap if already signed in
      const { data } = await supabase.auth.getClaims();

      if (data?.claims) return;

      const [nonce, hashedNonce] = await generateNonce();

      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        nonce: hashedNonce,

        // Only allow NITR accounts
        hd: "nitrkl.ac.in",

        use_fedcm_for_prompt: true,

        callback: async (response: CredentialResponse) => {
          try {
            if (!response.credential) {
              throw new Error("No Google credential received");
            }

            const { error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: response.credential,
              nonce,
            });

            if (error) throw error;

            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (!user?.email?.endsWith("@nitrkl.ac.in")) {
              await supabase.auth.signOut();

              toast.error(
                "Only NIT Rourkela accounts are allowed.",
              );

              return;
            }

            sessionStorage.setItem(
              "show-welcome-toast",
              "1",
            );

            router.push("/");
            router.refresh();
          } catch (err) {
            console.error(
              "Google One Tap login failed:",
              err,
            );

            toast.error(
              err instanceof Error
                ? err.message
                : "Google One Tap login failed.",
            );
          }
        },
      });

      google.accounts.id.prompt();
    } catch (err) {
      console.error("Google One Tap initialization failed:", err);
    }
  };

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      onLoad={() => {
        initializeGoogleOneTap();
      }}
    />
  );
}