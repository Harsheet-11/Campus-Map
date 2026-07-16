import { Suspense } from "react";
import ContinueWithGoogle from "@/components/auth/ContinueWithGoogle";
import GoogleOneTap from "@/components/auth/GoogleOneTap";
import LoginErrorToast from "@/components/toast/LoginErrorToast";

export default function LoginPage() {
  return (
    <main
      className="
        relative
        h-screen
        overflow-hidden
        flex
        items-center
        justify-center
        bg-[#F8EFD9]
        px-4
      "
    >
      {/* GoogleOneTap shows the one-tap prompt */}
      <GoogleOneTap />

      {/* Suspense required because LoginErrorToast
          uses useSearchParams internally             */}
      <Suspense>
        <LoginErrorToast />
      </Suspense>

      {/* background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(#D4C5A9 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-orange-300/30 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 h-[600px] w-[600px] rounded-full bg-yellow-300/30 blur-[120px]" />
      </div>

      {/* card */}
      <div
        className="
          relative z-10 w-full max-w-sm
          rounded-[36px] bg-[#FFFCF5]
          border-[3px] border-[#1F2937]
          p-8 sm:p-10
          text-center
          shadow-[8px_8px_0_#1F2937]
        "
      >
        {/* badge */}
        <div className="absolute -right-4 -top-4 rotate-12 rounded-full bg-orange-300 border-[3px] border-[#1F2937] px-4 py-1.5 text-xs font-black tracking-wide">
          NITR 🎫
        </div>

        {/* icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-yellow-300 border-[3px] border-[#1F2937] text-5xl shadow-[4px_4px_0_#1F2937] transition-transform hover:-translate-y-1">
          🗺️
        </div>

        <h1 className="mt-8 text-[28px] font-black leading-tight text-gray-900 tracking-tight">
          Welcome
          <br />
          NITRian 👋
        </h1>

        <p className="mt-3 text-sm font-medium text-gray-500">
          Your campus story starts here ✨
        </p>

        <div className="mt-7 flex justify-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100/80 text-sm ring-1 ring-orange-200">🍜</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100/80 text-sm ring-1 ring-blue-200">💻</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100/80 text-sm ring-1 ring-green-200">🌳</span>
        </div>

        <div className="mt-8">
          <ContinueWithGoogle />
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-400">
          <span>🔐</span>
          <span>@nitrkl.ac.in only</span>
        </div>
      </div>
    </main>
  );
}