import {
  createKindBadgeClass,
  createKindLabel,
  chainHighlightClass,
  chainLabelClass,
} from "@/lib/visualization-helpers";
import type { ScopeExampleKind, ScopeEntry } from "./types";

export const kindBadgeClass = createKindBadgeClass<ScopeExampleKind>({
  lookup: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  block: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  lexical: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<ScopeExampleKind>({
  lookup: "lookup",
  block: "block scope",
  lexical: "lexical",
});

export const SCOPE_BOX_BASE =
  "rounded-lg border px-3 py-2.5 transition-all duration-300";

export const scopeHighlightClass = chainHighlightClass;
export const scopeLabelClass = chainLabelClass;

export function scopeTypeBadge(type: ScopeEntry["type"]): { letter: string; className: string } {
  switch (type) {
    case "global":
      return { letter: "Global", className: "bg-pink-500/20 text-pink-300" };
    case "function":
      return { letter: "Function", className: "bg-amber-500/20 text-amber-300" };
    case "block":
      return { letter: "Block", className: "bg-cyan-500/20 text-cyan-300" };
  }
}
