import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type {
  AsyncAwaitKind,
  AsyncFnStatus,
  PromiseState,
  QueueTone,
  TimelineBar,
} from "./types";

export const kindBadgeClass = createKindBadgeClass<AsyncAwaitKind>({
  order: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  parallel: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  errors: "bg-rose-500/15 text-rose-400 border-rose-500/25",
});

export const kindLabel = createKindLabel<AsyncAwaitKind>({
  order: "execution order",
  parallel: "sequential vs parallel",
  errors: "errors",
});

export const QUEUE_ITEM_STYLES: Record<QueueTone, string> = {
  stack:
    "border-amber-300/35 bg-amber-400/10 text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.07)]",
  micro:
    "border-violet-300/35 bg-violet-400/10 text-violet-200 shadow-[0_0_14px_rgba(196,181,253,0.08)]",
};

export const FN_STATUS_STYLES: Record<AsyncFnStatus, string> = {
  idle: "bg-slate-500/20 text-slate-400",
  running: "bg-cyan-500/20 text-cyan-300",
  suspended: "bg-amber-500/20 text-amber-300",
  done: "bg-emerald-500/20 text-emerald-300",
};

export const FN_CARD_STYLES: Record<AsyncFnStatus, string> = {
  idle: "border-slate-500/30 bg-slate-800/30",
  running:
    "border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_18px_rgba(34,211,238,0.1)]",
  suspended:
    "border-amber-300/40 bg-amber-400/10 shadow-[0_0_18px_rgba(251,191,36,0.1)]",
  done: "border-emerald-300/30 bg-emerald-400/8",
};

export const PROMISE_STATE_STYLES: Record<PromiseState, string> = {
  pending: "text-slate-400",
  fulfilled: "text-emerald-300",
  rejected: "text-rose-300",
};

export const TIMELINE_FILL: Record<TimelineBar["tone"], string> = {
  cyan: "bg-cyan-400/80",
  green: "bg-emerald-400/80",
};

/** Total width of the timeline in the parallel example. */
export const TIMELINE_TOTAL_MS = 200;
