import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { VISUALIZATION_EMPTY_STATES } from "@/lib/visualization/uiCopy";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

/** Outer wrapper for a topic's panels, below the toolbar slot. */
export const VisualizationSection = ({ children, className }: LayoutProps) => (
  <section
    className={cn(
      "relative flex flex-col gap-4 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4",
      className,
    )}
  >
    {children}
  </section>
);

/** Two columns on wide screens: source code on the left, state panels on the right. */
export const SourceGrid = ({ children, className }: LayoutProps) => (
  <div
    className={cn("grid gap-4 xl:grid-cols-[auto_minmax(0,1fr)]", className)}
  >
    {children}
  </div>
);

/** Placeholder shown inside a state panel before playback starts. */
export const WaitingPlaceholder = ({ className }: { className?: string }) => (
  <p
    className={cn(
      "pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60",
      className,
    )}
  >
    {VISUALIZATION_EMPTY_STATES.waiting}
  </p>
);
