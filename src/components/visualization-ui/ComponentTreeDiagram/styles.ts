import type { TreeNodeHighlight } from "@/types/visualization";

export const NODE_HIGHLIGHT_STYLES: Record<TreeNodeHighlight, string> = {
  unchanged:
    "border-slate-500/30 bg-slate-800/40",
  updated:
    "border-amber-300/40 bg-amber-400/10 shadow-[0_0_14px_rgba(251,191,36,0.1)]",
  added:
    "border-emerald-300/40 bg-emerald-400/10 shadow-[0_0_14px_rgba(52,211,153,0.1)]",
  removed:
    "border-rose-400/40 bg-rose-400/10 shadow-[0_0_14px_rgba(244,63,94,0.1)] line-through",
  active:
    "border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_14px_rgba(34,211,238,0.12)]",
};

export const NODE_LABEL_STYLES: Record<TreeNodeHighlight, string> = {
  unchanged: "text-slate-400",
  updated: "text-amber-300",
  added: "text-emerald-300",
  removed: "text-rose-400",
  active: "text-cyan-300",
};

export const CONNECTOR_STYLES: Record<TreeNodeHighlight, string> = {
  unchanged: "bg-slate-600/40",
  updated: "bg-amber-400/40",
  added: "bg-emerald-400/40",
  removed: "bg-rose-400/40",
  active: "bg-cyan-400/40",
};
