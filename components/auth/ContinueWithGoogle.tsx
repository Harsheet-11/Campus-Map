"use client";

import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { FcGoogle } from "react-icons/fc";

export default function ContinueWithGoogle() {
  const supabase = createClient();

  async function login() {
    sessionStorage.setItem("show-welcome-toast", "1");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: {
          hd: "nitrkl.ac.in",
        },
      },
    });

    if (error) {
      sessionStorage.removeItem("show-welcome-toast");
      toast.error(error.message);
      return;
    }
    toast.success("Redirecting to Google...");
  }

  return (
    <div
      className="
      relative
      w-full
      max-w-sm
      mx-auto
      "
    >


      <Button
        // onClick={login}
        variant="outline"
        className="
        group

        h-14
        sm:h-16

        w-full

        rounded-2xl

        border-[3px]
        border-[#1F2937]

        bg-[#FFFCF5]

        text-black

        text-base
        sm:text-lg

        font-black


        shadow-[0_5px_0px_#1F2937]
        sm:shadow-[0_6px_0px_#1F2937]


        transition-all
        duration-200


        hover:-translate-y-1

        hover:bg-white

        hover:shadow-[0_8px_0px_#1F2937]


        active:translate-y-1

        active:shadow-none

        "
      >
        <FcGoogle
          className="
          mr-3

          h-6
          w-6

          transition-transform

          group-hover:rotate-12

          "
        />
        Enter Campus 🚪
      </Button>

      <p
        className="
        mt-3
        text-center
        text-xs
        text-gray-400
        "
      >
        🔐 Use your NITR Google account
      </p>
    </div>
  );
}
