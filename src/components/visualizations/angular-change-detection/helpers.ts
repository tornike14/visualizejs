import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type {
  AngularKind,
  CheckResult,
  SignalNodeKind,
  SignalNodeState,
} from "./types";

export const kindBadgeClass = createKindBadgeClass<AngularKind>({
  zone: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  onpush: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  signals: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<AngularKind>({
  zone: "zone.js",
  onpush: "OnPush",
  signals: "signals",
});

export const CHECK_RESULT_STYLES: Record<CheckResult, string> = {
  changed: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  same: "border-slate-500/30 bg-slate-500/8 text-slate-300",
  skipped: "border-slate-700/40 bg-slate-900/40 text-slate-500",
  traversed: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  stale: "border-rose-500/30 bg-rose-500/8 text-rose-300",
  pass: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
};

export const CHECK_RESULT_LABELS: Record<CheckResult, string> = {
  changed: "CHANGED",
  same: "SAME",
  skipped: "SKIP",
  traversed: "PASS THRU",
  stale: "STALE",
  pass: "OK",
};

export const SIGNAL_KIND_LABELS: Record<SignalNodeKind, string> = {
  signal: "signal",
  computed: "computed",
  view: "template",
};

export const SIGNAL_STATE_STYLES: Record<SignalNodeState, string> = {
  clean: "border-slate-500/30 bg-slate-800/40 text-slate-300",
  dirty: "border-rose-400/40 bg-rose-400/10 text-rose-200 shadow-[0_0_14px_rgba(244,63,94,0.1)]",
  updated:
    "border-amber-300/40 bg-amber-400/10 text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.1)]",
  reading:
    "border-cyan-300/40 bg-cyan-400/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.12)]",
};

export const SIGNAL_STATE_LABELS: Record<SignalNodeState, string> = {
  clean: "clean",
  dirty: "dirty",
  updated: "updated",
  reading: "reading",
};
