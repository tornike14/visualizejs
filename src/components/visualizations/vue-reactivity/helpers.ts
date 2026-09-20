import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type {
  BindingKind,
  DepStatus,
  TrapResult,
  VueReactivityKind,
} from "./types";

export const kindBadgeClass = createKindBadgeClass<VueReactivityKind>({
  track: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  computed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  pitfalls: "bg-rose-500/15 text-rose-400 border-rose-500/25",
});

export const kindLabel = createKindLabel<VueReactivityKind>({
  track: "track and trigger",
  computed: "computed caching",
  pitfalls: "ref vs reactive",
});

export const TRAP_RESULT_STYLES: Record<TrapResult, string> = {
  track: "border-emerald-500/30 bg-emerald-500/8 text-emerald-200",
  trigger: "border-amber-500/30 bg-amber-500/8 text-amber-200",
  noop: "border-slate-500/30 bg-slate-500/8 text-slate-400",
  miss: "border-rose-500/30 bg-rose-500/8 text-rose-200",
};

export const TRAP_RESULT_LABELS: Record<TrapResult, string> = {
  track: "TRACK",
  trigger: "TRIGGER",
  noop: "NO-OP",
  miss: "NO DEP",
};

export const DEP_STATUS_STYLES: Record<DepStatus, string> = {
  idle: "border-slate-600/40 bg-slate-800/30",
  tracking:
    "border-emerald-300/40 bg-emerald-400/10 shadow-[0_0_18px_rgba(52,211,153,0.1)]",
  triggering:
    "border-amber-300/40 bg-amber-400/10 shadow-[0_0_18px_rgba(251,191,36,0.1)]",
};

export const BINDING_STYLES: Record<BindingKind, string> = {
  reactive: "border-cyan-300/40 bg-cyan-400/10 text-cyan-200",
  ref: "border-violet-300/40 bg-violet-400/10 text-violet-200",
  toRef: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
  plain: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};

export const BINDING_LABELS: Record<BindingKind, string> = {
  reactive: "reactive",
  ref: "ref",
  toRef: "toRef",
  plain: "plain value",
};
