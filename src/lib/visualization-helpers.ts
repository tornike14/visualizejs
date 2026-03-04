import type { ChainHighlight } from "@/types/visualization";

// ---------------------------------------------------------------------------
// Generic kind-badge helpers
// ---------------------------------------------------------------------------

/**
 * Creates a kindBadgeClass function from a kind→CSS-class mapping.
 *
 * Every visualization defines a "kind" union (e.g. PromiseKind, GCKind) and
 * maps each value to a Tailwind badge class string.  This factory removes the
 * boilerplate switch statement.
 *
 * @example
 * const kindBadgeClass = createKindBadgeClass<ScopeExampleKind>({
 *   lookup: "bg-violet-500/15 text-violet-400 border-violet-500/25",
 *   block:  "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
 * });
 */
export function createKindBadgeClass<K extends string>(
  map: Record<K, string>,
): (kind: K) => string {
  return (kind) => map[kind];
}

/**
 * Creates a kindLabel function from a kind→display-label mapping.
 *
 * @example
 * const kindLabel = createKindLabel<ScopeExampleKind>({
 *   lookup: "lookup",
 *   block:  "block scope",
 * });
 */
export function createKindLabel<K extends string>(
  map: Record<K, string>,
): (kind: K) => string {
  return (kind) => map[kind];
}

// ---------------------------------------------------------------------------
// Chain / scope highlight helpers (ScopeChain & PrototypalInheritance)
// ---------------------------------------------------------------------------

/** CSS classes for a chain-object box border/bg based on highlight state. */
export function chainHighlightClass(highlight?: ChainHighlight): string {
  switch (highlight) {
    case "active":
      return "border-amber-300/40 bg-amber-400/10 shadow-[0_0_18px_rgba(251,191,36,0.1)]";
    case "searching":
      return "border-violet-300/40 bg-violet-400/10 shadow-[0_0_18px_rgba(196,181,253,0.1)]";
    case "found":
      return "border-emerald-300/40 bg-emerald-400/10 shadow-[0_0_18px_rgba(52,211,153,0.1)]";
    default:
      return "border-slate-500/30 bg-slate-800/30";
  }
}

/** CSS text-color class for a chain-object label based on highlight state. */
export function chainLabelClass(highlight?: ChainHighlight): string {
  switch (highlight) {
    case "active":
      return "text-amber-300";
    case "searching":
      return "text-violet-300";
    case "found":
      return "text-emerald-300";
    default:
      return "text-slate-400";
  }
}
