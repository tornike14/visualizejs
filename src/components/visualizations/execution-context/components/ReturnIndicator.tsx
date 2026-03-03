/** Return value indicator */
export function ReturnIndicator({ value }: { value: string }) {
  return (
    <div className="viz-slide-in flex items-center justify-center gap-2 rounded-lg border border-pink-300/30 bg-pink-400/5 px-3 py-2">
      <svg viewBox="0 0 16 12" className="h-3 w-4 flex-shrink-0 text-pink-400" aria-hidden="true">
        <path
          d="M10 1v4H2m0 0l3-3M2 5l3 3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-mono text-[10px] uppercase tracking-wider text-pink-300/70">
        return
      </span>
      <span className="font-mono text-xs font-semibold text-pink-200">
        {value}
      </span>
    </div>
  );
}
