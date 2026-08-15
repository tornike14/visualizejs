"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopicToggle } from "../TopicToggle";
import { FollowLinkedInButton } from "../FollowLinkedInButton";
import { Separator } from "@/components/ui/separator";
import { getTopicsByCategory } from "@/lib/topics";
import type { Category } from "@/types";
import { ScrollableTopicList } from "./ScrollableTopicList";
import { CollapseIcon } from "./SidebarIcons";
import { categoryRoute } from "./utils";

export function SidebarContent({
  activeCategory,
  onCategoryChange,
  onLinkClick,
  onCollapse,
  showFooterExtras = true,
}: {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  onLinkClick?: () => void;
  onCollapse?: () => void;
  showFooterExtras?: boolean;
}) {
  const pathname = usePathname();
  const filteredTopics = getTopicsByCategory(activeCategory);
  const otherCategory: Category =
    activeCategory === "javascript" ? "react" : "javascript";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <Link
          href="/"
          className="group inline-flex px-1 py-1 transition-all"
          onClick={onLinkClick}
        >
          <span className="bg-gradient-to-r from-cyan-300 via-sky-300 via-violet-300 to-amber-300 bg-clip-text text-[1.55rem] font-black tracking-[0.02em] text-transparent drop-shadow-[0_0_14px_rgba(34,211,238,0.24)] transition-all group-hover:drop-shadow-[0_0_20px_rgba(244,114,182,0.3)]">
            VisualizeJS
          </span>
        </Link>

        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            title="Collapse sidebar"
            className="cursor-pointer rounded-lg border border-slate-600/50 bg-slate-800/40 p-1.5 text-slate-400 transition-all hover:border-slate-500/70 hover:bg-slate-700/50 hover:text-slate-200"
          >
            <CollapseIcon />
          </button>
        )}
      </div>

      <div className="px-4 pb-3">
        <TopicToggle
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      <Separator className="bg-[rgba(71,85,105,0.55)]" />

      <ScrollableTopicList
        topics={filteredTopics}
        pathname={pathname}
        onLinkClick={onLinkClick}
      />

      <Separator className="bg-[rgba(71,85,105,0.55)]" />

      <div className="space-y-3 px-4 py-3">
        <p className="text-xs text-[color:var(--app-text-secondary)]">
          {filteredTopics.length} topic{filteredTopics.length !== 1 && "s"} in{" "}
          {activeCategory === "javascript" ? "JavaScript" : "React"}
        </p>
        <Link
          href={categoryRoute(otherCategory)}
          onClick={onLinkClick}
          className="flex w-fit text-xs text-[color:var(--app-text-secondary)] underline decoration-cyan-300/30 underline-offset-4 transition-colors hover:text-[color:var(--app-text-primary)]"
        >
          Browse {otherCategory === "javascript" ? "JavaScript" : "React"} topics
        </Link>
        {showFooterExtras && (
          <>
            <FollowLinkedInButton onClick={onLinkClick} />
            <p className="text-[10px] tracking-[0.1em] text-slate-500">
              Made by{" "}
              <a
                href="https://www.linkedin.com/in/tornike-nizharadze/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-slate-400 hover:text-slate-300 transition-colors"
              >
                Tornike
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
