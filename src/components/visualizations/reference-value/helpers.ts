import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { ReferenceExample, ReferenceKind, ReferenceStep } from "./types";
import type { SourceLine } from "@/types/visualization";

/* ── Helpers ── */

export function getEffectiveData(
  example: ReferenceExample,
  activeMethodId: string
): { codeLines: SourceLine[]; steps: ReferenceStep[] } {
  if (example.kind !== "deep") {
    return { codeLines: example.codeLines, steps: example.steps };
  }
  const variant =
    example.variants.find((v) => v.methodId === activeMethodId) ??
    example.variants[0];
  return { codeLines: variant.codeLines, steps: variant.steps };
}

export const kindBadgeClass = createKindBadgeClass<ReferenceKind>({
  primitive: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  reference: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  shallow: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  deep: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<ReferenceKind>({
  primitive: "by value",
  reference: "by reference",
  shallow: "shallow copy",
  deep: "deep copy",
});

export const SLOT_TONE_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  violet: "border-violet-500/30 bg-violet-500/8 text-violet-300",
  pink: "border-pink-500/30 bg-pink-500/8 text-pink-300",
} as const;
