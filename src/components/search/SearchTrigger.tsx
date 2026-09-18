"use client";

import { Search } from "lucide-react";
import { openCommandPalette } from "./CommandPalette";
import { cn } from "@/lib/utils";

interface SearchTriggerProps {
  compact?: boolean;
  className?: string;
}

export const SearchTrigger = ({ compact = false, className }: SearchTriggerProps) => {
  if (compact) {
    return (
      <button
        type="button"
        onClick={openCommandPalette}
        title="Search topics"
        aria-label="Search topics"
        className={cn(
          "cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700/40 hover:text-slate-200",
          className,
        )}
      >
        <Search className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCommandPalette}
      className={cn(
        "app-surface-flat flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-slate-400 transition-all hover:border-pink-300/35 hover:text-slate-200",
        className,
      )}
    >
      <Search className="h-3.5 w-3.5" />
      <span className="flex-1">Search topics</span>
      <kbd className="rounded border border-slate-600/60 bg-slate-900/70 px-1.5 py-0.5 font-mono text-[10px]">
        &#8984;K
      </kbd>
    </button>
  );
};
