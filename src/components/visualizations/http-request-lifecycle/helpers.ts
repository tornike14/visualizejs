import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { HttpRequestKind, TableRowTone } from "./types";

export const kindBadgeClass = createKindBadgeClass<HttpRequestKind>({
  roundtrip: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  server: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  errors: "bg-rose-500/15 text-rose-400 border-rose-500/25",
});

export const kindLabel = createKindLabel<HttpRequestKind>({
  roundtrip: "round trip",
  server: "inside the server",
  errors: "status codes",
});

const ROW_STYLES: Record<TableRowTone, string> = {
  neutral: "border-slate-600/40 bg-slate-800/40 text-slate-200",
  active:
    "border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.16)]",
  done: "border-emerald-300/30 bg-emerald-400/8 text-emerald-100",
  failed: "border-rose-400/40 bg-rose-400/10 text-rose-200",
  muted: "border-slate-700/40 bg-slate-900/40 text-slate-500",
};

export const rowStyle = (tone: TableRowTone = "neutral") => ROW_STYLES[tone];
