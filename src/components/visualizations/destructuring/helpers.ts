import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { DestructuringKind } from "./types";

/* ── Helpers ── */

export const kindBadgeClass = createKindBadgeClass<DestructuringKind>({
  array: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  object: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  nested: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  params: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<DestructuringKind>({
  array: "array",
  object: "object",
  nested: "nested",
  params: "params",
});

export const BINDING_TONE_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  violet: "border-violet-500/30 bg-violet-500/8 text-violet-300",
  pink: "border-pink-500/30 bg-pink-500/8 text-pink-300",
} as const;
