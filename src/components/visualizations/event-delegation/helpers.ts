import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { EventDelegationKind, NodeHighlight } from "./types";

/* ── Helpers ── */

export const kindBadgeClass = createKindBadgeClass<EventDelegationKind>({
  bubbling: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "stop-propagation": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  delegation: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<EventDelegationKind>({
  bubbling: "bubbling",
  "stop-propagation": "stopPropagation",
  delegation: "delegation",
});

export function nodeHighlightClass(highlight: NodeHighlight): string {
  switch (highlight) {
    case "capture-active":
      return "border-cyan-400/50 bg-cyan-400/10";
    case "target-active":
      return "border-amber-400/50 bg-amber-400/10";
    case "bubble-active":
      return "border-emerald-400/50 bg-emerald-400/10";
    case "stopped":
      return "border-rose-400/50 bg-rose-400/10";
    default:
      return "border-slate-500/30 bg-slate-800/30";
  }
}

export function phaseColorClass(phase: string): string {
  switch (phase) {
    case "capture":
      return "text-cyan-400";
    case "target":
      return "text-amber-400";
    case "bubble":
      return "text-emerald-400";
    default:
      return "text-slate-400";
  }
}
