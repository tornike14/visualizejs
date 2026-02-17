"use client";

import { useState, useCallback, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";


export interface ExampleOption {
  id: string;
  title: string;
  description: string;
}

interface ExampleSelectorProps<T extends ExampleOption> {
  examples: T[];
  activeId: string;
  onSelect: (id: string) => void;
  renderBadge?: (example: T) => ReactNode;
}


export function ExampleSelector<T extends ExampleOption>({
  examples,
  activeId,
  onSelect,
  renderBadge,
}: ExampleSelectorProps<T>) {
  const [open, setOpen] = useState(false);
  const active = examples.find((e) => e.id === activeId);

  const handleClose = useCallback(() => setOpen(false), []);
  const containerRef = useClickOutside<HTMLDivElement>(open, handleClose);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Select example: ${active?.title ?? "none selected"}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "app-surface-subtle flex min-w-[16rem] items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition-all hover:border-pink-300/35 hover:bg-[rgba(22,33,59,0.72)]",
          open && "ring-2 ring-pink-300/50"
        )}
      >
        <span>{active?.title ?? "Select example"}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Select example"
          className="app-surface absolute left-0 top-full z-50 mt-2 flex w-[22rem] flex-col gap-1 overflow-hidden rounded-2xl border-[color:var(--app-border)] p-1.5 shadow-[0_18px_36px_rgba(2,6,23,0.5)]"
        >
          {examples.map((ex) => (
            <button
              key={ex.id}
              type="button"
              role="option"
              aria-selected={ex.id === activeId}
              onClick={() => {
                onSelect(ex.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full cursor-pointer flex-col gap-1 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm transition-all",
                ex.id === activeId
                  ? "border-pink-300/30 bg-[rgba(31,45,74,0.65)]"
                  : "hover:border-[rgba(71,85,105,0.6)] hover:bg-[rgba(22,33,59,0.62)]"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-100">{ex.title}</span>
                {renderBadge?.(ex)}
              </div>
              <span className="line-clamp-2 text-xs text-slate-400">
                {ex.description}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
