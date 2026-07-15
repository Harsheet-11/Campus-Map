"use client";

import { OnboardingOverlay } from "@/components/auth/OnboardingOverlay";

interface AuthGateProps {
  loggedIn:   boolean;
  hasProfile: boolean;
  children:   React.ReactNode;
}


export function AuthGate({ loggedIn, hasProfile, children }: AuthGateProps) {
  return (
    <>
      {children}

      {loggedIn && !hasProfile && (
        <OnboardingOverlay defaultOpen={true} />
      )}
    </>
  );
}