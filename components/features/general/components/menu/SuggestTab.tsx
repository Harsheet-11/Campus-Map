"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";

type SuggestTabProps = {
  // Needed so we know which canteen to POST to
  canteenId: string;
};

export default function SuggestTab({ canteenId }: SuggestTabProps) {
  const [dishName, setDishName] = useState("");
  const [suggestion, setSuggestion] = useState("");

  // Track the submission state
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation before hitting the API
    if (!dishName.trim() || !suggestion.trim()) {
      setErrorMessage("Please fill in both fields.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/canteens/${canteenId}/food`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dish_name: dishName.trim(),
          suggestion: suggestion.trim(),
        }),
      });

      if (!res.ok) {
        // The API returns { error: "..." } on failure
        const body = await res.json();

        // 401 means not logged in
        if (res.status === 401) {
          setErrorMessage("You must be logged in to suggest a dish.");
        } else {
          setErrorMessage(body.error ?? "Something went wrong.");
        }

        setStatus("error");
        return;
      }

      // Success — clear the form and show confirmation
      setDishName("");
      setSuggestion("");
      setStatus("success");

    } catch {
      // Network failure or JSON parse error
      setErrorMessage("Could not reach the server. Try again.");
      setStatus("error");
    }
  };

  // After a successful submission, show a thank you message
  // User can click "Suggest another" to reset
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 font-sans">
        <p className="text-[22px]">🎉</p>
        <p
          className="text-[14px] font-extrabold text-gray-900 text-center"
          style={{ letterSpacing: "-0.01em" }}
        >
          Suggestion submitted!
        </p>
        <p
          className="text-[12.5px] text-gray-500 font-medium text-center"
          style={{ letterSpacing: "-0.003em" }}
        >
          We will review it and add it to the menu if approved.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-[12.5px] font-bold text-amber-600 underline underline-offset-2"
        >
          Suggest another dish
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 pt-1 font-sans"
    >
      <div>
        <label
          className="text-[12.5px] font-bold text-gray-900 mb-1.5 block"
          style={{ letterSpacing: "-0.005em" }}
        >
          Dish Name
        </label>
        <input
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          className="w-full bg-gray-50 rounded-xl border border-gray-200 px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 focus:outline-none focus:border-[#FFCC33] focus:ring-2 focus:ring-yellow-100 placeholder:text-gray-400 placeholder:font-medium transition"
          placeholder="e.g. Peri Peri Pizza"
          maxLength={80}
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label
          className="text-[12.5px] font-bold text-gray-900 mb-1.5 block"
          style={{ letterSpacing: "-0.005em" }}
        >
          Your Suggestion
        </label>
        <textarea
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
          className="w-full bg-gray-50 rounded-xl border border-gray-200 px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 resize-none focus:outline-none focus:border-[#FFCC33] focus:ring-2 focus:ring-yellow-100 placeholder:text-gray-400 placeholder:font-medium transition"
          rows={4}
          placeholder="Describe the dish and why the canteen should add it..."
          maxLength={500}
          disabled={status === "loading"}
        />
      </div>

      {/* Error message from API or validation */}
      {status === "error" && errorMessage && (
        <p className="text-[12px] font-semibold text-red-500">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-[#FFCC33] hover:bg-[#FFC107] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl py-3 font-extrabold text-[13.5px] text-gray-900 flex items-center justify-center gap-1.5 shadow-sm transition-all mt-1"
        style={{ letterSpacing: "-0.005em" }}
      >
        {status === "loading" ? "Submitting..." : "Submit Suggestion"}
        {status !== "loading" && (
          <HugeiconsIcon icon={SparklesIcon} size={14} />
        )}
      </button>
    </form>
  );
}