"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";

export default function SuggestTab() {
  return (
    <form className="space-y-3 pt-1 font-sans">
      <div>
        <label
          className="text-[12.5px] font-bold text-gray-900 mb-1.5 block"
          style={{ letterSpacing: "-0.005em" }}
        >
          Dish Name
        </label>
        <input
          className="w-full bg-gray-50 rounded-xl border border-gray-200 px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 focus:outline-none focus:border-[#FFCC33] focus:ring-2 focus:ring-yellow-100 placeholder:text-gray-400 placeholder:font-medium transition"
          placeholder="e.g. Peri Peri Pizza"
        />
      </div>

      <div>
        <label
          className="text-[12.5px] font-bold text-gray-900 mb-1.5 block"
          style={{ letterSpacing: "-0.005em" }}
        >
          Description
        </label>
        <textarea
          className="w-full bg-gray-50 rounded-xl border border-gray-200 px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 resize-none focus:outline-none focus:border-[#FFCC33] focus:ring-2 focus:ring-yellow-100 placeholder:text-gray-400 placeholder:font-medium transition"
          rows={2}
          placeholder="Tell us about your dish..."
        />
      </div>

      <div>
        <label
          className="text-[12.5px] font-bold text-gray-900 mb-1.5 block"
          style={{ letterSpacing: "-0.005em" }}
        >
          Why should we add it?
        </label>
        <textarea
          className="w-full bg-gray-50 rounded-xl border border-gray-200 px-3.5 py-2.5 text-[13px] font-semibold text-gray-900 resize-none focus:outline-none focus:border-[#FFCC33] focus:ring-2 focus:ring-yellow-100 placeholder:text-gray-400 placeholder:font-medium transition"
          rows={2}
          placeholder="Share your thoughts..."
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#FFCC33] hover:bg-[#FFC107] active:scale-[0.98] rounded-xl py-3 font-extrabold text-[13.5px] text-gray-900 flex items-center justify-center gap-1.5 shadow-sm transition-all mt-1"
        style={{ letterSpacing: "-0.005em" }}
      >
        Submit Suggestion
        <HugeiconsIcon icon={SparklesIcon} size={14} />
      </button>
    </form>
  );
}