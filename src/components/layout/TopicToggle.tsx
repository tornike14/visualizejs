"use client";

import Image from "next/image";
import { CATEGORY_LIST } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface TopicToggleProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export const TopicToggle = ({
  activeCategory,
  onCategoryChange,
}: TopicToggleProps) => {
  return (
    <div
      className="app-surface-flat flex items-center gap-1 rounded-2xl p-1"
      role="tablist"
      aria-label="Topic categories"
    >
      {CATEGORY_LIST.map((category) => {
        const isActive = category.id === activeCategory;
        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center rounded-xl px-2 py-2 text-sm font-medium transition-all",
              isActive
                ? category.toggleActiveClass
                : "border border-transparent hover:bg-[rgba(22,33,59,0.62)]",
            )}
            aria-label={category.label}
            aria-selected={isActive}
            title={category.label}
          >
            <Image
              src={category.iconSrc}
              alt=""
              width={22}
              height={22}
              className={cn(
                "h-[22px] w-[22px] object-contain transition-opacity",
                isActive ? "opacity-100" : "opacity-70",
              )}
            />
            <span className="sr-only">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};
