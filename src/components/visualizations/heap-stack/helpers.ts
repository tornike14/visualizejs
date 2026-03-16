import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { HeapStackKind } from "./types";

export const kindBadgeClass = createKindBadgeClass<HeapStackKind>({
  stack: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  heap: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  "call-stack": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  gc: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<HeapStackKind>({
  stack: "stack",
  heap: "heap",
  "call-stack": "call stack",
  gc: "GC",
});

export const FRAME_TONE_MAP: Record<
  number,
  string
> = {
  0: "border-slate-500/30 bg-slate-500/8 text-slate-300",
  1: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  2: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  3: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
};

export const HEAP_STATUS_MAP = {
  alive: "",
  unreachable: "opacity-50 ring-1 ring-rose-400/40",
  collected: "hidden",
} as const;

export const HEAP_TONE_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  violet: "border-violet-500/30 bg-violet-500/8 text-violet-300",
} as const;
