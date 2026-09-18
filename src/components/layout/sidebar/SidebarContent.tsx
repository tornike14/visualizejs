"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TopicToggle } from "../TopicToggle";
import { FollowLinkedInButton } from "../FollowLinkedInButton";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, CATEGORY_LIST } from "@/lib/categories";
import { CREATOR_LINKEDIN_URL } from "@/lib/constants";
import { getTopicsByCategory } from "@/lib/topics";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { ScrollableTopicList } from "./ScrollableTopicList";
import { CollapseIcon } from "./SidebarIcons";

export const SidebarContent = ({
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
}) => {
  const pathname = usePathname();
  const filteredTopics = getTopicsByCategory(activeCategory);
  const category = CATEGORIES[activeCategory];
  const otherCategories = CATEGORY_LIST.filter(
    (entry) => entry.id !== activeCategory,
  );

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

      <div className="flex flex-col gap-2 px-4 pb-3">
        <SearchTrigger />
        <TopicToggle
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
        <Link
          href={category.route}
          onClick={onLinkClick}
          className="flex items-center justify-between rounded-xl px-2 py-1 text-xs text-[color:var(--app-text-secondary)] transition-colors hover:text-[color:var(--app-text-primary)]"
        >
          <span className="font-semibold tracking-[0.08em] uppercase">
            {category.label}
          </span>
          <span className="font-mono">{filteredTopics.length} topics</span>
        </Link>
      </div>

      <Separator className="bg-[rgba(71,85,105,0.55)]" />

      <ScrollableTopicList
        topics={filteredTopics}
        pathname={pathname}
        onLinkClick={onLinkClick}
      />

      <Separator className="bg-[rgba(71,85,105,0.55)]" />

      <div className="space-y-3 px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {otherCategories.map((entry) => (
            <Link
              key={entry.id}
              href={entry.route}
              onClick={onLinkClick}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.06em] uppercase transition-all hover:brightness-125",
                entry.badgeClass,
              )}
            >
              {entry.label}
            </Link>
          ))}
        </div>
        {showFooterExtras && (
          <>
            <FollowLinkedInButton onClick={onLinkClick} />
            <p className="text-[10px] tracking-[0.1em] text-slate-500">
              Made by{" "}
              <a
                href={CREATOR_LINKEDIN_URL}
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
};
