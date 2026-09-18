import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { EmbeddingsKind } from "./types";

export const kindBadgeClass = createKindBadgeClass<EmbeddingsKind>({
  lookup: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  similarity: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  position: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<EmbeddingsKind>({
  lookup: "lookup table",
  similarity: "cosine similarity",
  position: "position matters",
});

/** Panel titles per example kind. A missing key hides that panel. */
export interface PanelLayout {
  primaryTable: string;
  secondaryTable?: string;
  chips: string;
  chipsShowIndex: boolean;
  bars?: string;
  computation?: string;
}

export const PANEL_LAYOUT: Record<EmbeddingsKind, PanelLayout> = {
  lookup: {
    primaryTable: "Embedding Matrix",
    chips: "Input Sequence",
    chipsShowIndex: true,
    bars: "Selected Vector",
    computation: "Output X",
  },
  similarity: {
    primaryTable: "Vectors",
    secondaryTable: "Similarity Matrix",
    chips: "Operands",
    chipsShowIndex: false,
    computation: "Computation",
  },
  position: {
    primaryTable: "Token Embedding",
    secondaryTable: "Position Embedding",
    chips: "Input Sequence",
    chipsShowIndex: true,
    bars: "Input Vector",
    computation: "Computation",
  },
};

/** Formats a signed value with a fixed sign and two decimals. */
export function formatSigned(value: number): string {
  const text = Math.abs(value).toFixed(2);
  return value < 0 ? `-${text}` : `+${text}`;
}

/** Background colour for a signed cell: cyan for positive, rose for negative. */
export function cellBackground(value: number): string {
  const alpha = 0.08 + Math.min(1, Math.abs(value)) * 0.6;
  const rgb = value < 0 ? "251,113,133" : "34,211,238";
  return `rgba(${rgb}, ${alpha.toFixed(3)})`;
}
