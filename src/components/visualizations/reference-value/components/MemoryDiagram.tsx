import { cn } from "@/lib/utils";
import type { MemorySlot, HeapObject } from "../types";
import { SLOT_TONE_MAP } from "../helpers";

export function MemoryDiagram({
  slots,
  heapObjects,
}: {
  slots: MemorySlot[];
  heapObjects: HeapObject[];
}) {
  if (slots.length === 0 && heapObjects.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {slots.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-violet-300/80">
            Variables
          </p>
          <div className="space-y-1.5">
            {slots.map((slot, idx) => (
              <div
                key={`${slot.variable}-${idx}`}
                className={cn(
                  "viz-slide-in flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs",
                  SLOT_TONE_MAP[slot.tone]
                )}
              >
                <span className="font-semibold">{slot.variable}</span>
                <span>{slot.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {heapObjects.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-violet-300/80">
            Heap
          </p>
          <div className="space-y-2">
            {heapObjects.map((obj, idx) => (
              <div
                key={`${obj.id}-${idx}`}
                className={cn(
                  "viz-slide-in rounded-lg border px-3 py-2.5",
                  SLOT_TONE_MAP[obj.tone],
                  obj.isShared && "ring-1 ring-pink-400/40"
                )}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                    {obj.label}
                  </span>
                  {obj.isShared && (
                    <span className="rounded bg-pink-500/20 px-1.5 py-0.5 text-[10px] text-pink-300">
                      shared
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
        </div>
      )}
    </div>
  );
}
