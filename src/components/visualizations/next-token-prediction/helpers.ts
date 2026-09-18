import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { MetricBarTone } from "@/components/visualization-ui/MetricBars";
import type {
  CandidateMode,
  CandidateStatus,
  NextTokenKind,
  TableRowTone,
} from "./types";

export const kindBadgeClass = createKindBadgeClass<NextTokenKind>({
  softmax: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  temperature: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  truncation: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<NextTokenKind>({
  softmax: "softmax",
  temperature: "temperature",
  truncation: "top-k / top-p",
});

export const CANDIDATE_TONES: Record<CandidateStatus, MetricBarTone> = {
  neutral: "cyan",
  active: "amber",
  kept: "cyan",
  chosen: "green",
  dropped: "rose",
};

export const CANDIDATE_MODE_LABELS: Record<CandidateMode, string> = {
  logit: "logits (raw scores)",
  scaled: "logits / T",
  exp: "exp(logit)",
  prob: "probabilities",
};

export const TABLE_ROW_STYLES: Record<TableRowTone, string> = {
  neutral: "text-slate-300",
  kept: "text-cyan-200",
  chosen: "bg-emerald-400/8 text-emerald-200",
  dropped: "text-rose-300/70 line-through",
  muted: "text-slate-500",
};

/** Softmax of `logits / T`, computed with a max shift for stability. */
export const softmax = (logits: number[], temperature = 1): number[] => {
  const scaled = logits.map((l) => l / temperature);
  const max = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - max));
  const sum = exps.reduce((acc, e) => acc + e, 0);
  return exps.map((e) => e / sum);
};

/** Shannon entropy in bits. */
export const entropyBits = (probs: number[]): number =>
  -probs.reduce((acc, p) => (p > 0 ? acc + p * Math.log2(p) : acc), 0);

export const round2 = (value: number): number => Math.round(value * 100) / 100;

export const fmt2 = (value: number): string => value.toFixed(2);
