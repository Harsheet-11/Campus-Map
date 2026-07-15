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
      <GoogleOneTap />
      <LoginErrorToast />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CLEAN BACKGROUND (Minimal Dot Grid + Soft Glows)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(#D4C5A9 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top-left soft warm glow */}
        <div
          className="
            absolute -left-20 -top-20
            h-[500px] w-[500px]
            rounded-full
            bg-orange-300/30
            blur-[120px]
          "
        />

        {/* Bottom-right soft yellow glow */}
        <div
          className="
            absolute -bottom-32 -right-32
            h-[600px] w-[600px]
            rounded-full
            bg-yellow-300/30
            blur-[120px]
          "
        />
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          CARD (Focused & Breathable)
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-sm

          rounded-[36px]
          bg-[#FFFCF5]
          border-[3px]
          border-[#1F2937]

          p-8
          sm:p-10

          text-center
          shadow-[8px_8px_0_#1F2937]
        "
      >
        {/* Playful Badge */}
        <div
          className="
            absolute
            -right-4
            -top-4
            rotate-12
            rounded-full
            bg-orange-300
            border-[3px]
            border-[#1F2937]
            px-4
            py-1.5
            text-xs
            font-black
            tracking-wide
          "
        >
          NITR 🎫
        </div>

        {/* Floating Icon */}
        <div
          className="
            mx-auto
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-[24px]
            bg-yellow-300
            border-[3px]
            border-[#1F2937]
            text-5xl
            shadow-[4px_4px_0_#1F2937]
            /* Gentle hover lift */
            transition-transform
            hover:-translate-y-1
          "
        >
          🗺️
        </div>

        {/* Main Typography */}
        <h1
          className="
            mt-8
            text-[28px]
            font-black
            leading-tight
            text-gray-900
            tracking-tight
          "
        >
          Welcome
          <br />
          NITRian 👋
        </h1>

        <p
          className="
            mt-3
            text-sm
            font-medium
            text-gray-500
          "
        >
          Your campus story starts here ✨
        </p>

        {/* Minimal Identity Pills */}
        <div
          className="
            mt-7
            flex
            justify-center
            gap-3
          "
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100/80 text-sm ring-1 ring-orange-200">
            🍜
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100/80 text-sm ring-1 ring-blue-200">
            💻
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100/80 text-sm ring-1 ring-green-200">
            🌳
          </span>
        </div>

        {/* Login Action */}
        <div className="mt-8">
          <ContinueWithGoogle />
        </div>

        {/* Clean Footer Note */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-400">
          <span>🔐</span>
          <span>@nitrkl.ac.in only</span>
        </div>
      </div>
    </main>
  );
}
