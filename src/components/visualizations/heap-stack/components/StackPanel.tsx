import { cn } from "@/lib/utils";
import type { StackFrame } from "../types";
import { FRAME_TONE_MAP } from "../helpers";

export function StackPanel({ frames }: { frames: StackFrame[] }) {
  if (frames.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  const reversed = [...frames].reverse();

  return (
    <div className="space-y-2">
      {reversed.map((frame, visualIdx) => {
        const frameIdx = frames.length - 1 - visualIdx;
        const isTop = visualIdx === 0;
        const toneClass =
          FRAME_TONE_MAP[frameIdx] ?? FRAME_TONE_MAP[3];

        return (
          <div
            key={frame.id}
            className={cn(
              "viz-slide-in rounded-lg border px-3 py-2.5",
              toneClass,
              isTop && "ring-1 ring-amber-400/30"
            )}
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
                {frame.label}
              </span>
              {isTop && frames.length > 1 && (
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
                  active
                </span>
              )}
            </div>
            <div className="space-y-1">
              {frame.variables.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center justify-between font-mono text-xs"
                >
                  <span className="opacity-70">{v.name}</span>
                  <span>{v.value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
