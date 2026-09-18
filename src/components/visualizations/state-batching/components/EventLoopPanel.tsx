import { cn } from "@/lib/utils";
import type { EventLoopSnapshot } from "../types";
import { pendingStyle, runKindLabel, runKindStyle } from "../helpers";

export const EventLoopPanel = ({
  snapshot,
}: {
  snapshot: EventLoopSnapshot | null;
}) => {
  if (!snapshot) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  const isIdle = snapshot.runningKind === "idle";

  return (
    <div className="space-y-3 font-mono text-xs">
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-slate-500">
          running now
        </div>
        <div
          key={`${snapshot.runningKind}|${snapshot.running ?? ""}`}
          className={cn(
            "viz-slide-in flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2",
            runKindStyle(snapshot.runningKind),
          )}
        >
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
            {runKindLabel(snapshot.runningKind)}
          </span>
          <span className={cn("break-words", isIdle && "text-slate-500")}>
            {snapshot.running ?? "call stack empty"}
          </span>
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-slate-500">
          waiting to run
        </div>
        {snapshot.pending.length === 0 ? (
          <p className="text-slate-500/70">nothing queued</p>
        ) : (
          <div className="space-y-1.5">
            {snapshot.pending.map((work) => (
              <div
                key={`${work.kind}|${work.label}`}
                className={cn(
                  "viz-slide-in flex flex-wrap items-center gap-2 rounded-lg border border-dashed px-3 py-1.5",
                  pendingStyle(work.kind),
                )}
              >
                <span className="shrink-0 text-[10px] font-bold uppercase">
                  {work.kind}
                </span>
                <span className="break-words">{work.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
