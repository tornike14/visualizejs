import { cn } from "@/lib/utils";
import type { SchedulerState } from "../types";

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="w-24 shrink-0 text-[10px] uppercase tracking-[0.18em] text-slate-500">
      {label}
    </span>
    {children}
  </div>
);

export const SchedulerPanel = ({ scheduler }: { scheduler: SchedulerState | null }) => {
  if (!scheduler) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="space-y-2.5 font-mono text-xs">
      <Row label="activeEffect">
        {scheduler.activeEffect ? (
          <span className="viz-slide-in rounded border border-cyan-300/50 bg-cyan-400/12 px-2 py-0.5 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.2)]">
            {scheduler.activeEffect}
          </span>
        ) : (
          <span className="text-slate-500">undefined</span>
        )}
      </Row>

      <Row label="job queue">
        {scheduler.queue.length === 0 ? (
          <span className="text-slate-500">[ ]</span>
        ) : (
          scheduler.queue.map((job) => (
            <span
              key={job}
              className="viz-slide-in rounded border border-amber-300/40 bg-amber-400/10 px-2 py-0.5 text-amber-200"
            >
              {job}
            </span>
          ))
        )}
      </Row>

      <Row label="microtask">
        <span
          className={cn(
            "rounded border px-2 py-0.5",
            scheduler.flushPending
              ? "border-violet-300/40 bg-violet-400/10 text-violet-200"
              : "border-slate-600/40 bg-slate-800/30 text-slate-500",
          )}
        >
          {scheduler.flushPending ? "flushJobs queued" : "idle"}
        </span>
      </Row>

      {scheduler.ranNow.length > 0 && (
        <Row label="ran now">
          {scheduler.ranNow.map((effect) => (
            <span
              key={effect}
              className="viz-slide-in rounded border border-emerald-300/40 bg-emerald-400/10 px-2 py-0.5 text-emerald-200"
            >
              {effect}
            </span>
          ))}
        </Row>
      )}
    </div>
  );
};
