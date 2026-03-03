"use client";

import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepCarouselProps<TItem> {
  items: readonly TItem[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  renderSlide: (item: TItem, index: number) => ReactNode;
  renderLeadingActions?: ReactNode;
  getItemId?: (item: TItem, index: number) => string;
  previousLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  onFinish?: () => void;
  className?: string;
  contentClassName?: string;
  footerClassName?: string;
}

export const StepCarousel = <TItem,>({
  items,
  activeIndex,
  onIndexChange,
  renderSlide,
  renderLeadingActions,
  getItemId,
  previousLabel = "Previous",
  nextLabel = "Next",
  finishLabel = "Finish",
  onFinish,
  className,
  contentClassName,
  footerClassName,
}: StepCarouselProps<TItem>) => {
  const hasItems = items.length > 0;
  const maxIndex = Math.max(items.length - 1, 0);
  const currentIndex = hasItems ? Math.min(Math.max(activeIndex, 0), maxIndex) : 0;
  const isFirstItem = currentIndex === 0;
  const isLastItem = currentIndex === maxIndex;

  const handlePrevious = () => {
    if (isFirstItem) return;
    onIndexChange(currentIndex - 1);
  };

  const handleNext = () => {
    if (isLastItem) {
      onFinish?.();
      return;
    }
    onIndexChange(currentIndex + 1);
  };

  if (!hasItems) return null;
  const currentItem = items[currentIndex];

  return (
    <div className={cn("flex flex-col", className)}>
      <div className={cn("relative mt-5 overflow-hidden", contentClassName)}>
        <div
          key={`step-${currentIndex}`}
          className="w-full animate-[vjs-carousel-enter_320ms_cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        >
          {renderSlide(currentItem, currentIndex)}
        </div>
      </div>

      <footer
        className={cn(
          "mt-6 flex flex-wrap items-center justify-between gap-3",
          footerClassName,
        )}
      >
        <div className="flex items-center gap-1.5">
          {items.map((item, index) => (
            <button
              key={getItemId ? getItemId(item, index) : `step-${index + 1}`}
              type="button"
              onClick={() => onIndexChange(index)}
              className={cn(
                "h-2.5 w-8 cursor-pointer rounded-full border transition-all",
                index === currentIndex
                  ? "border-cyan-200/80 bg-cyan-300/70"
                  : "border-slate-500/75 bg-slate-700/55 hover:bg-slate-600/65",
              )}
              aria-label={`Go to step ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {renderLeadingActions}

          <button
            type="button"
            onClick={handlePrevious}
            disabled={isFirstItem}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-500/60 bg-slate-900/65 px-3 py-2 text-sm text-slate-100 transition-all hover:border-slate-400/80 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ChevronLeft className="h-4 w-4" />
            {previousLabel}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-cyan-300/45 bg-gradient-to-br from-cyan-500/25 to-violet-400/15 px-3 py-2 text-sm font-medium text-cyan-100 transition-all hover:border-cyan-200/70 hover:shadow-[0_0_18px_rgba(34,211,238,0.22)]"
          >
            {isLastItem ? finishLabel : nextLabel}
            {!isLastItem && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
};
