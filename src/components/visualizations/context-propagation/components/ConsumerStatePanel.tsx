import { cn } from "@/lib/utils";
import type { ConsumerSubscription } from "../types";

export function ConsumerStatePanel({
  consumers,
}: {
  consumers: ConsumerSubscription[];
}) {
  if (consumers.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no consumers subscribed
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {consumers.map((consumer) => (
        <div
          key={`${consumer.consumerId}-${consumer.contextName}`}
          className={cn(
            "viz-slide-in flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
            consumer.isRerendering
              ? "border-rose-500/30 bg-rose-500/8 text-rose-300"
              : "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
          )}
        >
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
            {consumer.consumerId}
          </span>
          <span className="text-slate-400">{consumer.contextName}</span>
          <span className="font-semibold">{consumer.currentValue}</span>
          {consumer.isRerendering && (
            <span className="ml-auto shrink-0 rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-rose-400">
              re-rendering
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
