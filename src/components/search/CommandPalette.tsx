"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TopicProgressMark } from "@/components/progress/TopicProgressMark";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/categories";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import { topics } from "@/lib/topics";
import { cn } from "@/lib/utils";
import { filterTopics, type SearchEntry } from "./searchTopics";

const OPEN_EVENT = "vjs:open-search";

/** Any component can open the palette without holding a reference to it. */
export const openCommandPalette = () => {
  window.dispatchEvent(new Event(OPEN_EVENT));
};

export const CommandPalette = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);

  const entries = useMemo<SearchEntry[]>(
    () => [
      ...CATEGORY_LIST.map((category) => ({
        kind: "category" as const,
        id: category.id,
        title: category.indexTitle,
        subtitle: category.tagline,
        route: category.route,
        category: category.id,
      })),
      ...topics.map((topic) => ({
        kind: "topic" as const,
        id: topic.id,
        title: topic.title,
        subtitle: topic.description,
        route: topic.route,
        category: topic.category,
        difficulty: topic.difficulty,
      })),
    ],
    [],
  );

  const results = useMemo(
    () => filterTopics(entries, query),
    [entries, query],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const go = useCallback(
    (entry: SearchEntry) => {
      close();
      router.push(entry.route);
    },
    [close, router],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }
      if (event.key === "/" && !open) {
        const target = event.target as HTMLElement | null;
        const typing =
          target &&
          (target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable);
        if (!typing) {
          event.preventDefault();
          setOpen(true);
        }
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, results]);

  if (!open) return null;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const entry = results[activeIndex];
      if (entry) go(entry);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center bg-slate-950/78 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search topics"
        onKeyDown={handleKeyDown}
        className="app-surface flex w-full max-w-2xl flex-col overflow-hidden rounded-3xl"
      >
        <div className="flex items-center gap-3 border-b border-[color:var(--app-border)] px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search topics, categories, or concepts"
            aria-label="Search topics"
            autoComplete="off"
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
          <kbd className="hidden rounded-md border border-slate-600/60 bg-slate-900/70 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:inline">
            Esc
          </kbd>
        </div>

        <div
          ref={listRef}
          role="listbox"
          aria-label="Results"
          className="max-h-[52vh] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-slate-500">
              No topics match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            results.map((entry, index) => {
              const category = CATEGORIES[entry.category];
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${entry.kind}-${entry.id}`}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  data-index={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => go(entry)}
                  className={cn(
                    "flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    isActive
                      ? "border-pink-300/30 bg-[rgba(31,45,74,0.7)]"
                      : "border-transparent hover:bg-[rgba(22,33,59,0.62)]",
                  )}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-slate-100">
                        {entry.title}
                      </span>
                      {entry.kind === "topic" && (
                        <TopicProgressMark topicId={entry.id} />
                      )}
                    </div>
                    <span className="line-clamp-1 text-xs text-slate-400">
                      {entry.subtitle}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={cn("text-[10px]", category.badgeClass)}
                    >
                      {entry.kind === "category" ? "Category" : category.label}
                    </Badge>
                    {entry.difficulty && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "hidden text-[10px] sm:inline-flex",
                          DIFFICULTY_COLORS[entry.difficulty],
                        )}
                      >
                        {entry.difficulty}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[color:var(--app-border)] px-4 py-2 text-[11px] text-slate-500">
          <span>
            {results.length} result{results.length === 1 ? "" : "s"}
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <kbd className="rounded border border-slate-600/60 px-1 font-mono">
              &uarr;&darr;
            </kbd>
            navigate
            <kbd className="ml-2 inline-flex items-center rounded border border-slate-600/60 px-1 font-mono">
              <CornerDownLeft className="h-3 w-3" />
            </kbd>
            open
          </span>
        </div>
      </div>
    </div>
  );
};
