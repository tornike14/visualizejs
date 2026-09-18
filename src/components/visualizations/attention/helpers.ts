import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { AttentionKind, VectorTone, WorkTone } from "./types";

export const kindBadgeClass = createKindBadgeClass<AttentionKind>({
  scores: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  mask: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  heads: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<AttentionKind>({
  scores: "scaled dot-product",
  mask: "causal mask",
  heads: "multi-head",
});

export const VECTOR_ROW_STYLES: Record<VectorTone, string> = {
  neutral: "border-slate-600/40 bg-slate-800/40 text-slate-200",
  active:
    "border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.16)]",
  muted: "border-slate-700/40 bg-slate-900/40 text-slate-500",
};

export const WORK_LINE_STYLES: Record<WorkTone, string> = {
  neutral: "border-slate-600/40 bg-slate-800/40 text-slate-300",
  active: "border-amber-300/40 bg-amber-400/10 text-amber-100",
  result: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
};

/** Bars display the raw number but fill relative to this scale. */
export const OUTPUT_BAR_SCALE = 3;

export const formatValue = (value: number) => value.toFixed(2);
