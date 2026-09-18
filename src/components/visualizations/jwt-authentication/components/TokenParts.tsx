import { cn } from "@/lib/utils";
import {
  TOKEN_PART_BASE,
  TOKEN_PART_LABELS,
  TOKEN_PART_LABEL_COLOR,
  TOKEN_PART_STATE,
} from "../helpers";
import type { TokenPart } from "../types";

const partFingerprint = (part: TokenPart) =>
  `${part.id}|${part.state}|${part.encoded}|${part.decoded}`;

const STATE_TAG: Partial<Record<TokenPart["state"], string>> = {
  active: "building",
  match: "match",
  miss: "mismatch",
};

export const TokenParts = ({ parts }: { parts: TokenPart[] }) => {
  if (parts.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no token yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {parts.map((part, index) => (
        <div
          key={`${part.id}-${partFingerprint(part)}`}
          className={cn(
            "viz-slide-in rounded-xl border px-3 py-2 font-mono text-[11px] transition-all duration-300",
            TOKEN_PART_BASE[part.id],
            TOKEN_PART_STATE[part.state],
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.18em]",
                TOKEN_PART_LABEL_COLOR[part.id],
              )}
            >
              {index > 0 && <span className="mr-1.5 text-slate-500">.</span>}
              {TOKEN_PART_LABELS[part.id]}
            </span>
            {STATE_TAG[part.state] && (
              <span className="rounded bg-black/25 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.14em]">
                {STATE_TAG[part.state]}
              </span>
            )}
          </div>
          <pre className="mt-1 whitespace-pre-wrap break-all text-slate-200/90">
            {part.decoded}
          </pre>
          {part.encoded && (
            <p className="mt-1 break-all border-t border-white/5 pt-1 text-[10px] leading-relaxed text-slate-400">
              {part.encoded}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
