import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { DebounceThrottleKind, EntryTone, TickState } from "./types";

export const kindBadgeClass = createKindBadgeClass<DebounceThrottleKind>({
  debounce: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  throttle: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  compare: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<DebounceThrottleKind>({
  debounce: "debounce",
  throttle: "throttle",
  compare: "compare",
});

export const TICK_STYLES: Record<TickState, string> = {
  event: "h-3 w-3 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]",
  ignored: "h-2.5 w-2.5 border border-slate-500/70 bg-slate-800",
  pending:
    "viz-pulse-dot h-3 w-3 border-2 border-amber-300 bg-amber-400/20 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  cancelled: "h-2.5 w-2.5 border border-rose-400/70 bg-rose-500/15",
  call: "h-3.5 w-3.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]",
  trailing: "h-3.5 w-3.5 bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.8)]",
};

export const TICK_LEGEND: { state: TickState; label: string }[] = [
  { state: "event", label: "event" },
  { state: "ignored", label: "ignored" },
  { state: "pending", label: "timer pending" },
  { state: "cancelled", label: "timer cancelled" },
  { state: "call", label: "call" },
  { state: "trailing", label: "trailing call" },
];

export const ENTRY_VALUE_STYLES: Record<EntryTone, string> = {
  active: "border-cyan-400/40 bg-cyan-400/10 text-cyan-200",
  pending: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  cleared: "border-rose-400/40 bg-rose-400/10 text-rose-200 line-through",
  success: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  muted: "border-slate-600/50 bg-slate-800/40 text-slate-400",
};
