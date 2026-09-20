import { cn } from "@/lib/utils";

export type TokenChipTone =
  | "neutral"
  | "active"
  | "match"
  | "miss"
  | "muted"
  | "amber"
  | "violet";

export interface TokenChip {
  id: string;
  label: string;
  /** Optional secondary value, e.g. a token id or a score. */
  value?: string;
  tone?: TokenChipTone;
}

interface TokenChipsProps {
  chips: TokenChip[];
  emptyLabel?: string;
  /** Show a small index above each chip. */
  showIndex?: boolean;
  className?: string;
}

const CHIP_STYLES: Record<TokenChipTone, string> = {
  neutral: "border-slate-600/50 bg-slate-800/50 text-slate-200",
  active:
    "border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.2)]",
  match: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
  miss: "border-rose-400/40 bg-rose-400/10 text-rose-200",
  muted: "border-slate-700/40 bg-slate-900/40 text-slate-500",
  amber: "border-amber-300/40 bg-amber-400/10 text-amber-200",
  violet: "border-violet-300/40 bg-violet-400/10 text-violet-200",
};

/**
 * Row of labelled chips. Used for token sequences, cache entries, queue
 * contents, and any ordered list where each item needs its own state.
 */
export const TokenChips = ({
  chips,
  emptyLabel = "empty",
  showIndex = false,
  className,
}: TokenChipsProps) => {
  if (chips.length === 0) {
    return (
      <p className="pt-2 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {chips.map((chip, index) => (
        <li
          key={chip.id}
          className={cn(
            "viz-slide-in flex flex-col items-center gap-0.5 rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-all duration-300",
            CHIP_STYLES[chip.tone ?? "neutral"],
          )}
        >
          {showIndex && (
            <span className="text-[9px] text-slate-500 tabular-nums">
              {index}
            </span>
          )}
          <span className="whitespace-pre font-semibold">{chip.label}</span>
          {chip.value != null && (
            <span className="text-[10px] opacity-75">{chip.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
};
