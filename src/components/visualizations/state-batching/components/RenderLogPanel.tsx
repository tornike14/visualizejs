import { cn } from "@/lib/utils";
import type { RenderLogEntry, RenderTotals } from "../types";
import { renderLogStyle, renderLogTag } from "../helpers";

interface RenderLogPanelProps {
  entries: RenderLogEntry[];
  totals?: RenderTotals;
}

export const RenderLogPanel = ({ entries, totals }: RenderLogPanelProps) => {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no renders yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {totals ? (
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <div className="rounded-lg border border-rose-500/25 bg-rose-500/6 px-3 py-1.5 text-rose-200/90">
            <span className="text-[10px] uppercase tracking-wider text-rose-300/70">
              React 17
            </span>
            <div className="font-semibold">
              {totals.react17} {totals.react17 === 1 ? "render" : "renders"}
            </div>
          </div>
          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/8 px-3 py-1.5 text-cyan-200">
            <span className="text-[10px] uppercase tracking-wider text-cyan-300/70">
              React 18+
            </span>
            <div className="font-semibold">
              {totals.react18} {totals.react18 === 1 ? "render" : "renders"}
            </div>
          </div>
        </div>
      ) : null}
      <div className="space-y-1.5">
        {entries.map((entry) => (
          <div
            key={`${entry.id}|${entry.kind}|${entry.detail}`}
            className={cn(
              "viz-slide-in flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3 py-2 font-mono text-xs",
              renderLogStyle(entry.kind),
            )}
          >
            <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
              {renderLogTag(entry.kind)}
            </span>
            <span className="font-semibold">{entry.label}</span>
            <span className="text-slate-400">{entry.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
