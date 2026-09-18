import { cn } from "@/lib/utils";
import type { GradientEntry } from "../types";
import { signedValueClass } from "../helpers";

const entryFingerprint = (entry: GradientEntry) =>
  `${entry.id}|${entry.display}|${entry.active ? 1 : 0}`;

/**
 * Gradients in the order the backward pass produced them, each with the
 * chain rule product that computed it.
 */
export const GradientTable = ({ entries }: { entries: GradientEntry[] }) => {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no gradients yet
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {entries.map((entry) => (
        <li
          key={entryFingerprint(entry)}
          className={cn(
            "viz-slide-in grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
            entry.active
              ? "border-violet-300/50 bg-violet-400/12 text-violet-100 shadow-[0_0_14px_rgba(196,181,253,0.16)]"
              : "border-slate-600/40 bg-slate-800/40 text-slate-300",
          )}
        >
          <span className="font-semibold">{entry.label}</span>
          <span className="truncate text-[11px] text-slate-400">
            = {entry.formula}
          </span>
          <span
            className={cn(
              "text-right font-semibold tabular-nums",
              signedValueClass(entry.display),
            )}
          >
            {entry.display}
          </span>
        </li>
      ))}
    </ul>
  );
};
