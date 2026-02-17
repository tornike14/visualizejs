"use client";

import Image from "next/image";
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
        className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all ${
          activeCategory === "javascript"
            ? "border border-yellow-300/30 bg-yellow-400/15 shadow-[0_0_16px_rgba(251,191,36,0.16)]"
            : "border border-transparent hover:bg-[rgba(22,33,59,0.62)]"
        }`}
        aria-label="JavaScript"
        aria-pressed={activeCategory === "javascript"}
      >
        <Image
          src="/icons/javascript.svg"
          alt=""
          width={22}
          height={22}
          className={`h-[22px] w-[22px] object-contain transition-opacity ${
            activeCategory === "javascript" ? "opacity-100" : "opacity-75"
          }`}
        />
        <span className="sr-only">JavaScript</span>
      </button>
      <button
        onClick={() => onCategoryChange("react")}
        className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition-all ${
          activeCategory === "react"
            ? "border border-cyan-300/30 bg-cyan-400/15 shadow-[0_0_16px_rgba(34,211,238,0.16)]"
            : "border border-transparent hover:bg-[rgba(22,33,59,0.62)]"
        }`}
        aria-label="React"
        aria-pressed={activeCategory === "react"}
      >
        <Image
          src="/icons/react.svg"
          alt=""
          width={22}
          height={22}
          className={`h-[22px] w-[22px] object-contain transition-opacity ${
            activeCategory === "react" ? "opacity-100" : "opacity-75"
          }`}
        />
        <span className="sr-only">React</span>
      </button>
    </div>
  );
}
