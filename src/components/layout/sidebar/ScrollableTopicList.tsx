"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { groupTopics } from "@/lib/topics";
import type { Topic } from "@/types";
import { SidebarTopicLink } from "./SidebarTopicLink";

export const ScrollableTopicList = ({
  topics: filteredTopics,
  pathname,
  onLinkClick,
}: {
  topics: Topic[];
  pathname: string;
  onLinkClick?: () => void;
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);

  const checkScroll = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const threshold = 4;
    setCanScrollDown(
      el.scrollTop + el.clientHeight < el.scrollHeight - threshold,
    );
    setCanScrollUp(el.scrollTop > threshold);
  }, []);

  useEffect(() => {
    // Radix ScrollArea renders the actual scrollable viewport as the first child
    // with data-slot="scroll-area-viewport". We grab it after mount.
    const root = viewportRef.current;
    if (!root) return;
    const viewport = root.querySelector<HTMLDivElement>(
      "[data-slot='scroll-area-viewport']",
    );
    if (!viewport) return;

    // Replace ref with actual viewport for scroll checks
    viewportRef.current = viewport;
    checkScroll();

    viewport.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(viewport);

    return () => {
      viewport.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, filteredTopics.length]);

  return (
    <div className="relative min-h-0 flex-1">
      <ScrollArea className="h-full px-3 py-3" type="scroll" ref={viewportRef}>
        <nav className="flex flex-col gap-2" aria-label="Topics">
          {filteredTopics.length === 0 ? (
            <div className="rounded-2xl border border-[rgba(71,85,105,0.45)] bg-[rgba(13,21,40,0.62)] px-3 py-3 text-xs text-[color:var(--app-text-secondary)]">
              New topics coming soon.
            </div>
          ) : (
            groupTopics(filteredTopics).map((group) => (
              <div key={group.label ?? "all"} className="flex flex-col gap-2">
                {group.label && (
                  <p className="px-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {group.label}
                  </p>
                )}
                {group.topics.map((topic) => (
                  <SidebarTopicLink
                    key={topic.id}
                    topic={topic}
                    isActive={
                      pathname === topic.route ||
                      pathname.startsWith(`${topic.route}/`)
                    }
                    onClick={onLinkClick}
                  />
                ))}
              </div>
            ))
          )}
        </nav>
      </ScrollArea>

      {/* Top fade - hints there's content above */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-[var(--app-surface-strong)] to-transparent transition-opacity duration-300",
          canScrollUp ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Bottom fade - hints there's content below */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-t from-[var(--app-surface-strong)] to-transparent transition-opacity duration-300",
          canScrollDown ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
};
