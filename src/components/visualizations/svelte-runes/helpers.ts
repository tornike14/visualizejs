import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type {
  DomNodeState,
  SignalNodeType,
  SignalStatus,
  SvelteRunesKind,
} from "./types";

export const kindBadgeClass = createKindBadgeClass<SvelteRunesKind>({
  signals: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  compiler: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  deep: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<SvelteRunesKind>({
  signals: "signal graph",
  compiler: "compiled output",
  deep: "deep state",
});

export const SIGNAL_TYPE_LABELS: Record<SignalNodeType, string> = {
  source: "src",
  derived: "drv",
  template: "tpl",
  effect: "fx",
};

export const SIGNAL_TYPE_STYLES: Record<SignalNodeType, string> = {
  source: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  derived: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  template: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  effect: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export const SIGNAL_STATUS_STYLES: Record<SignalStatus, string> = {
  clean: "bg-slate-500/10 text-slate-400 border-slate-500/25",
  unread: "bg-slate-500/10 text-slate-400 border-dashed border-slate-500/40",
  dirty: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  "maybe-dirty": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  scheduled: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  running: "bg-cyan-500/15 text-cyan-200 border-cyan-400/40",
};

export const SIGNAL_ROW_STYLES: Record<SignalStatus, string> = {
  clean: "border-slate-500/30 bg-slate-800/30",
  unread: "border-slate-500/30 bg-slate-800/20",
  dirty: "border-rose-400/40 bg-rose-400/8",
  "maybe-dirty": "border-amber-400/35 bg-amber-400/8",
  scheduled: "border-amber-400/35 bg-amber-400/8",
  running:
    "border-cyan-300/50 bg-cyan-400/10 shadow-[0_0_16px_rgba(34,211,238,0.14)]",
};

export const DOM_STATE_STYLES: Record<DomNodeState, string> = {
  unchanged: "border-slate-500/30 bg-slate-800/30 text-slate-400",
  added: "border-emerald-400/40 bg-emerald-400/8 text-emerald-200",
  updated: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  active: "border-cyan-300/50 bg-cyan-400/10 text-cyan-100",
};

export const DOM_STATE_LABELS: Record<DomNodeState, string | null> = {
  unchanged: null,
  added: "added",
  updated: "set_text",
  active: "ref",
};
