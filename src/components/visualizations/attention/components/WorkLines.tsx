import { cn } from "@/lib/utils";
import { WORK_LINE_STYLES } from "../helpers";
import type { WorkLine } from "../types";

/** The arithmetic behind the current step, one expression per line. */
export const WorkLines = ({ lines }: { lines: WorkLine[] }) => {
  if (lines.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no arithmetic yet
      </p>
    );
  }

  return (
    <ol className="space-y-1.5">
      {lines.map((line) => (
        <li
          key={`${line.id}-${line.tone}-${line.text}`}
          className={cn(
            "viz-slide-in break-words rounded-lg border px-3 py-1.5 font-mono text-[11px] tabular-nums",
            WORK_LINE_STYLES[line.tone],
          )}
        >
          {line.text}
        </li>
      ))}
    </ol>
  );
};
