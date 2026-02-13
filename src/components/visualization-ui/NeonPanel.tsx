import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NeonTone = "amber" | "cyan" | "green" | "violet" | "pink" | "slate";

interface NeonPanelProps {
  title: string;
  tone: NeonTone;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

const TONE_STYLES: Record<NeonTone, { header: string; dot: string }> = {
  amber: {
    header: "bg-amber-400/6",
    dot: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]",
  },
  cyan: {
    header: "bg-cyan-400/8",
    dot: "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]",
  },
  green: {
    header: "bg-emerald-400/8",
    dot: "bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]",
  },
  violet: {
    header: "bg-violet-400/8",
    dot: "bg-violet-300 shadow-[0_0_12px_rgba(196,181,253,0.8)]",
  },
  pink: {
    header: "bg-pink-400/8",
    dot: "bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.8)]",
  },
  slate: {
    header: "bg-slate-300/5",
    dot: "bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.8)]",
  },
};

export function NeonPanel({
  title,
  tone,
  children,
  className,
  bodyClassName,
}: NeonPanelProps) {
  const toneStyles = TONE_STYLES[tone];

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-700/65 bg-[#0d1528]/90 shadow-[0_12px_30px_rgba(2,6,23,0.45)] backdrop-blur-sm",
        className
      )}
    >
      <header
        className={cn(
          "flex items-center gap-3 border-b border-slate-700/65 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-100",
          toneStyles.header
        )}
      >
        <span className={cn("h-2.5 w-2.5 rounded-full", toneStyles.dot)} />
        {title}
      </header>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}
