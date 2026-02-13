"use client";

import type { Category } from "@/types";

interface TopicToggleProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function TopicToggle({
  activeCategory,
  onCategoryChange,
}: TopicToggleProps) {
  return (
    <div className="app-surface-flat flex items-center gap-1 rounded-2xl p-1">
      <button
        onClick={() => onCategoryChange("javascript")}
        className={`flex-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
          activeCategory === "javascript"
            ? "border border-yellow-300/30 bg-yellow-400/15 text-yellow-200 shadow-[0_0_16px_rgba(251,191,36,0.16)]"
            : "border border-transparent text-[color:var(--app-text-secondary)] hover:text-[color:var(--app-text-primary)]"
        }`}
        aria-pressed={activeCategory === "javascript"}
      >
        JavaScript
      </button>
      <button
        onClick={() => onCategoryChange("react")}
        className={`flex-1 rounded-xl px-3 py-1.5 text-sm font-medium transition-all ${
          activeCategory === "react"
            ? "border border-cyan-300/30 bg-cyan-400/15 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.16)]"
            : "border border-transparent text-[color:var(--app-text-secondary)] hover:text-[color:var(--app-text-primary)]"
        }`}
        aria-pressed={activeCategory === "react"}
      >
        React
      </button>
    </div>
  );
}
