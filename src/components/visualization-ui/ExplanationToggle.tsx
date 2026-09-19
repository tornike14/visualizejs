"use client";

import { useExplanationMode } from "@/hooks/useExplanationMode";
import type { ExplanationMode } from "@/lib/explanationMode";
import { cn } from "@/lib/utils";

const OPTIONS: { mode: ExplanationMode; label: string; title: string }[] = [
  { mode: "simple", label: "Simple", title: "Plain-language explanations" },
  { mode: "detailed", label: "Detailed", title: "Full technical explanations" },
];

/** Two-way switch between plain-language and detailed step descriptions. */
export const ExplanationToggle = () => {
  const { mode, setMode } = useExplanationMode();

  return (
    <div
      role="radiogroup"
      aria-label="Explanation style"
      className="app-surface-flat inline-flex items-center gap-0.5 rounded-xl p-0.5"
    >
      {OPTIONS.map((option) => {
        const isActive = option.mode === mode;
        return (
          <button
            key={option.mode}
            type="button"
            role="radio"
            aria-checked={isActive}
            title={option.title}
            onClick={() => setMode(option.mode)}
            className={cn(
              "cursor-pointer rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-all",
              isActive
                ? "bg-emerald-400/15 text-emerald-200 shadow-[0_0_12px_rgba(52,211,153,0.16)]"
                : "text-slate-400 hover:text-slate-200",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
