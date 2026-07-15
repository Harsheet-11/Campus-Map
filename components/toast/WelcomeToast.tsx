"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";

export function WelcomeToast() {
  useEffect(() => {
    const shouldShow = sessionStorage.getItem("show-welcome-toast");

    if (shouldShow) {
      sessionStorage.removeItem("show-welcome-toast");
      toast.success("Welcome Back 🎉");
    }
  }, []);

  return null;
}