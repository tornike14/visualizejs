import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { PromiseKind, PromiseObj } from "./types";

export const kindBadgeClass = createKindBadgeClass<PromiseKind>({
  basic: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  chaining: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "async-await": "bg-amber-500/15 text-amber-400 border-amber-500/25",
});

export const kindLabel = createKindLabel<PromiseKind>({
  basic: "basic",
  chaining: "chaining",
  "async-await": "async/await",
});

export const QUEUE_ITEM_STYLE =
  "border-violet-300/35 bg-violet-400/10 text-violet-200 shadow-[0_0_14px_rgba(196,181,253,0.08)]";

export const PROMISE_STATE_BORDER: Record<PromiseObj["state"], string> = {
  pending:
    "border-slate-400/35 bg-slate-400/10 text-slate-300 shadow-[0_0_14px_rgba(148,163,184,0.06)]",
  fulfilled:
    "border-emerald-300/35 bg-emerald-400/10 text-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.08)]",
  rejected:
    "border-rose-300/35 bg-rose-400/10 text-rose-200 shadow-[0_0_14px_rgba(248,113,113,0.08)]",
};
