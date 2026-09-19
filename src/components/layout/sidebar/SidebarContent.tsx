"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { TopicToggle } from "../TopicToggle";
import { FollowLinkedInButton } from "../FollowLinkedInButton";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES } from "@/lib/categories";
import { CREATOR_LINKEDIN_URL } from "@/lib/constants";
import { getTopicsByCategory } from "@/lib/topics";
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

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <BrandLogo onClick={onLinkClick} />

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
