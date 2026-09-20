import { cn } from "@/lib/utils";
import type { CheckRecord } from "../types";
import { CHECK_RESULT_LABELS, CHECK_RESULT_STYLES } from "../helpers";

const checkFingerprint = (check: CheckRecord) =>
  `${check.id}|${check.result}|${check.oldValue}|${check.newValue}`;

export const ChecksPanel = ({ checks }: { checks: CheckRecord[] }) => {
  if (checks.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no checks yet
      </p>
    );
  }

  const compared = checks.filter(
    (check) => check.result === "changed" || check.result === "same",
  ).length;
  const skipped = checks.filter((check) => check.result === "skipped").length;
  const changed = checks.filter((check) => check.result === "changed").length;

  return (
    <div className="space-y-2">
      <ol className="space-y-1.5">
        {checks.map((check) => (
          <li
            key={checkFingerprint(check)}
            className={cn(
              "viz-slide-in flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3 py-2 font-mono text-xs",
              CHECK_RESULT_STYLES[check.result],
            )}
          >
            <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
              {CHECK_RESULT_LABELS[check.result]}
            </span>
            <span className="font-semibold">{check.component}</span>
            <span className="text-slate-400">{check.binding}</span>
            {check.oldValue !== "" && (
              <span className="ml-auto flex items-center gap-1 tabular-nums text-slate-400">
                <span>{check.oldValue}</span>
                <span className="text-slate-600">{"->"}</span>
                <span
                  className={
                    check.oldValue === check.newValue
                      ? "text-slate-400"
                      : "text-slate-100"
                  }
                >
                  {check.newValue}
                </span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <p className="px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
        compared {compared} / skipped {skipped} / changed {changed}
      </p>
    </div>
  );
};
