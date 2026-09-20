import { cn } from "@/lib/utils";
import type { FrameEntry } from "../types";
import { FRAME_LEGEND, FRAME_STYLES } from "../helpers";

interface FrameTimelineProps {
  frames: FrameEntry[];
}

export const FrameTimeline = ({ frames }: FrameTimelineProps) => {
  if (frames.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  const blocked = frames.filter((frame) => frame.kind === "blocked").length;

  return (
    <div className="space-y-3">
      <ol
        className="flex flex-wrap gap-1"
        aria-label="Main thread frames, 16 ms each"
      >
        {frames.map((frame, index) => (
          <li
            key={`${frame.id}|${frame.kind}|${frame.marker ?? ""}`}
            className={cn(
              "viz-slide-in flex h-9 w-9 flex-col items-center justify-center rounded-md border font-mono transition-colors duration-300",
              FRAME_STYLES[frame.kind],
            )}
            title={`frame ${index + 1}: ${frame.kind}`}
          >
            <span className="text-[11px] font-semibold leading-none">
              {frame.marker ?? ""}
            </span>
            <span className="mt-0.5 text-[8px] leading-none opacity-60">
              {index * 16}
            </span>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-slate-400">
        {FRAME_LEGEND.map((entry) => (
          <span key={entry.kind} className="flex items-center gap-1">
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-sm border",
                FRAME_STYLES[entry.kind],
              )}
            />
            {entry.label}
          </span>
        ))}
        <span className="ml-auto tabular-nums text-slate-500">
          {blocked} of {frames.length} frames blocked
        </span>
      </div>
    </div>
  );
};
