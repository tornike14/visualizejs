import type { QueueTone } from "./types";

export const QUEUE_ITEM_STYLES: Record<QueueTone, string> = {
  stack:
    "border-amber-300/35 bg-amber-400/10 text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.07)]",
  web: "border-cyan-300/35 bg-cyan-400/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.07)]",
  task: "border-emerald-300/35 bg-emerald-400/10 text-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.08)]",
  micro:
    "border-violet-300/35 bg-violet-400/10 text-violet-200 shadow-[0_0_14px_rgba(196,181,253,0.08)]",
};

export const iconBtnBase =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border p-2 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0";
