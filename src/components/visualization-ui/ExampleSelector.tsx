"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import type { ExampleOption } from "@/types/visualization";

export type { ExampleOption };

interface ExampleSelectorProps<T extends ExampleOption> {
  examples: readonly T[];
  activeId: string;
  onSelect: (id: string) => void;
  renderBadge?: (example: T) => ReactNode;
}

export const ExampleSelector = <T extends ExampleOption>({
  examples,
  activeId,
  onSelect,
  renderBadge,
}: ExampleSelectorProps<T>) => {
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const activeIndex = Math.max(
    examples.findIndex((example) => example.id === activeId),
    0,
  );
  const active = examples[activeIndex];

  const close = useCallback(() => setOpen(false), []);
  const containerRef = useClickOutside<HTMLDivElement>(open, close);

  const openList = () => {
    setFocusIndex(activeIndex);
    setOpen(true);
  };

  const select = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  // Move DOM focus with the highlighted option so screen readers follow along.
  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${focusIndex}"]`)
      ?.focus();
  }, [open, focusIndex]);

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setFocusIndex((index) => Math.min(index + 1, examples.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusIndex((index) => Math.max(index - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setFocusIndex(0);
        break;
      case "End":
        event.preventDefault();
        setFocusIndex(examples.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        select(examples[focusIndex].id);
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`Select example: ${active?.title ?? "none selected"}`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={(event) => {
          if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            event.preventDefault();
            openList();
          }
        }}
        className={cn(
          "app-surface-subtle flex min-w-[16rem] items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-100 transition-all hover:border-pink-300/35 hover:bg-[rgba(22,33,59,0.72)]",
          open && "ring-2 ring-pink-300/50",
        )}
      >
        <span>{active?.title ?? "Select example"}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Select example"
          onKeyDown={handleListKeyDown}
          className="app-surface absolute left-0 top-full z-50 mt-2 flex w-[22rem] flex-col gap-1 overflow-hidden rounded-2xl border-[color:var(--app-border)] p-1.5 shadow-[0_18px_36px_rgba(2,6,23,0.5)]"
        >
          {examples.map((example, index) => {
            const isSelected = example.id === activeId;
            return (
              <button
                key={example.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                data-index={index}
                tabIndex={index === focusIndex ? 0 : -1}
                onMouseEnter={() => setFocusIndex(index)}
                onClick={() => select(example.id)}
                className={cn(
                  "flex w-full cursor-pointer flex-col gap-1 rounded-xl border border-transparent px-3 py-2.5 text-left text-sm transition-all focus-visible:outline-none",
                  isSelected
                    ? "border-pink-300/30 bg-[rgba(31,45,74,0.65)]"
                    : "hover:border-[rgba(71,85,105,0.6)] hover:bg-[rgba(22,33,59,0.62)] focus-visible:border-[rgba(71,85,105,0.6)] focus-visible:bg-[rgba(22,33,59,0.62)]",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-100">
                    {example.title}
                  </span>
                  {renderBadge?.(example)}
                </div>
                <span className="line-clamp-2 text-xs text-slate-400">
                  {example.description}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
