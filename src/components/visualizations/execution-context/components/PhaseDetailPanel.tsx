import type { PhaseDetail } from "../types";

/** Detail panel: shows what's happening inside the active EC */
export function PhaseDetailPanel({ detail }: { detail: PhaseDetail }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {detail.label}
        </span>
      </div>
      <div className="space-y-1">
        {detail.items.map((item, i) => (
          <div
            key={`${detail.label}-${i}`}
            className="viz-slide-in flex items-start gap-2 rounded px-2 py-1 font-mono text-[11px] text-slate-300"
          >
            <span className="mt-0.5 flex-shrink-0 text-pink-400/70">
              {i === detail.items.length - 1 ? ">" : " "}
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
