import { cn } from "@/lib/utils";
import type { HeapObject } from "../types";
import { HEAP_TONE_MAP, HEAP_STATUS_MAP, heapFingerprint } from "../helpers";

export function GCHeapPanel({
  objects,
  gcSweep,
}: {
  objects: HeapObject[];
  gcSweep: boolean;
}) {
  const visible = objects.filter((o) => o.status !== "collected");

  if (visible.length === 0 && !gcSweep) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  if (visible.length === 0 && gcSweep) {
    return (
      <div className="relative min-h-[4rem] overflow-hidden rounded-lg">
        <div className="gc-swept pt-5 text-center font-mono text-xs tracking-[0.22em] text-emerald-400/80">
          memory freed
        </div>
      </div>
    );
  }

  return (
    <div className="relative space-y-2">
      {gcSweep && (
        <div className="gc-scanbar pointer-events-none absolute inset-0 z-10 rounded-lg" />
      )}
      {visible.map((obj) => (
        <div
          key={`${obj.id}-${heapFingerprint(obj)}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            HEAP_TONE_MAP[obj.tone],
            HEAP_STATUS_MAP[obj.status],
            gcSweep && obj.status === "unreachable" && "gc-shake"
          )}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
              {obj.label}
            </span>
            {obj.status === "unreachable" && (
              <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] text-rose-300">
                unreachable
              </span>
            )}
          </div>
          <div className="space-y-1">
            {obj.props.map((prop) => (
              <div
                key={prop.key}
                className="flex items-center justify-between font-mono text-xs"
              >
                <span className="opacity-70">{prop.key}</span>
                <span>{prop.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
