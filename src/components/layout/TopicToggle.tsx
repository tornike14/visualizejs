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
    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
      <button
        onClick={() => onCategoryChange("javascript")}
        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
          activeCategory === "javascript"
            ? "bg-yellow-500/20 text-yellow-400 shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={activeCategory === "javascript"}
      >
        JavaScript
      </button>
      <button
        onClick={() => onCategoryChange("react")}
        className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
          activeCategory === "react"
            ? "bg-cyan-500/20 text-cyan-400 shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={activeCategory === "react"}
      >
        React
      </button>
    </div>
  );
}
