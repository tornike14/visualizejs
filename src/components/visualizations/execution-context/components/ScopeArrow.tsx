import { cn } from "@/lib/utils";

/** Outer environment link arrow between stack items */
export function ScopeArrow({ active }: { active?: boolean }) {
  return (
    <div className="flex items-center justify-center py-0.5">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "h-3 w-px transition-colors duration-300",
            active ? "bg-pink-400/70" : "bg-slate-600/40"
          )}
        />
        <span
          className={cn(
            "font-mono text-[8px] transition-colors duration-300",
            active ? "text-pink-300" : "text-slate-600"
          )}
        >
          [[Outer]]
        </span>
        <svg
          viewBox="0 0 10 6"
          className={cn(
            "h-1.5 w-2.5 transition-colors duration-300",
            active ? "text-pink-400/70" : "text-slate-600/40"
          )}
          aria-hidden="true"
        >
          <path
            d="M0 0L5 6L10 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </div>
  );
}
