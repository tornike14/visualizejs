import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { StatTone, TokenizationKind } from "./types";

export const kindBadgeClass = createKindBadgeClass<TokenizationKind>({
  bpe: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  encode: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "edge-cases": "bg-rose-500/15 text-rose-400 border-rose-500/25",
});

export const kindLabel = createKindLabel<TokenizationKind>({
  bpe: "bpe training",
  encode: "encoding",
  "edge-cases": "edge cases",
});

export interface PanelTitles {
  segments: string;
  rules: string;
  aux: string;
  stats: string;
}

const PANEL_TITLES: Record<TokenizationKind, PanelTitles> = {
  bpe: {
    segments: "Current Segmentation",
    rules: "Vocabulary",
    aux: "Pair Frequencies",
    stats: "Stats",
  },
  encode: {
    segments: "Tokens",
    rules: "Merge Rules Applied",
    aux: "Byte View",
    stats: "Stats",
  },
  "edge-cases": {
    segments: "Tokens",
    rules: "Vocabulary Lookup",
    aux: "Byte View",
    stats: "Stats",
  },
};

export const panelTitles = (kind: TokenizationKind): PanelTitles =>
  PANEL_TITLES[kind];

export const STAT_TONE_STYLES: Record<StatTone, string> = {
  cyan: "border-cyan-400/30 text-cyan-200",
  green: "border-emerald-400/30 text-emerald-200",
  amber: "border-amber-400/30 text-amber-200",
  rose: "border-rose-400/30 text-rose-200",
  slate: "border-slate-600/50 text-slate-200",
};
