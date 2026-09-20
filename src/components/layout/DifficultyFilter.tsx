"use client";

import { DIFFICULTY_COLORS } from "@/lib/constants";
import { DIFFICULTY_LABELS, DIFFICULTY_ORDER } from "@/lib/difficulty";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

interface DifficultyFilterProps {
  value: Difficulty | null;
  counts: Record<Difficulty, number>;
  total: number;
  onChange: (level: Difficulty | null) => void;
}

const CHIP =
  "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-all disabled:cursor-not-allowed disabled:opacity-40";

/** Chips that narrow a topic list to one difficulty level. */
export const DifficultyFilter = ({
  value,
  counts,
  total,
  onChange,
}: DifficultyFilterProps) => (
  <div
    role="radiogroup"
    aria-label="Filter by difficulty"
    className="flex flex-wrap items-center gap-1.5"
  >
    <button
      type="button"
      role="radio"
      aria-checked={value === null}
      onClick={() => onChange(null)}
      className={cn(
        CHIP,
        value === null
          ? "border-slate-500/40 bg-slate-500/15 text-slate-100"
          : "border-transparent text-slate-400 hover:text-slate-200",
      )}
    >
      All
      <span className="tabular-nums opacity-70">{total}</span>
    </button>
    {DIFFICULTY_ORDER.map((level) => {
      const isActive = value === level;
      const count = counts[level];
      return (
        <button
          key={level}
          type="button"
          role="radio"
          aria-checked={isActive}
          disabled={count === 0}
          title={
            count === 0
              ? `No ${DIFFICULTY_LABELS[level].toLowerCase()} topics here yet`
              : undefined
          }
          onClick={() => onChange(isActive ? null : level)}
          className={cn(
            CHIP,
            isActive
              ? DIFFICULTY_COLORS[level]
              : "border-transparent text-slate-400 hover:text-slate-200",
          )}
        >
          {DIFFICULTY_LABELS[level]}
          <span className="tabular-nums opacity-70">{count}</span>
        </button>
      );
    })}
  </div>
);
