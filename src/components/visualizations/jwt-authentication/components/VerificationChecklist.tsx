import { cn } from "@/lib/utils";
import { CHECK_MARKS, CHECK_STYLES } from "../helpers";
import type { VerificationCheck } from "../types";

export const VerificationChecklist = ({
  checks,
}: {
  checks: VerificationCheck[];
}) => {
  if (checks.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no request yet
      </p>
    );
  }

  return (
    <ol className="space-y-1.5">
      {checks.map((check) => (
        <li
          key={`${check.id}-${check.status}-${check.detail}`}
          className={cn(
            "viz-slide-in flex items-start gap-2.5 rounded-lg border px-3 py-2 font-mono text-xs transition-all duration-300",
            CHECK_STYLES[check.status],
          )}
        >
          <span className="w-6 shrink-0 rounded bg-black/25 px-1 py-0.5 text-center text-[10px] font-bold uppercase">
            {CHECK_MARKS[check.status]}
          </span>
          <span className="min-w-0">
            <span className="font-semibold">{check.label}</span>
            {check.detail && (
              <span className="ml-2 break-words text-[11px] text-slate-400">
                {check.detail}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
};
