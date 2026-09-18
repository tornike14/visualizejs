const SHORTCUTS = [
  { keys: "Space", action: "play" },
  { keys: "← →", action: "step" },
  { keys: "R", action: "reset" },
] as const;

/** Compact reminder of the playback shortcuts, hidden on touch layouts. */
export const KeyboardHint = () => (
  <p
    className="hidden items-center gap-3 text-[11px] text-slate-500 lg:inline-flex"
    aria-label="Keyboard shortcuts"
  >
    {SHORTCUTS.map((shortcut) => (
      <span key={shortcut.action} className="inline-flex items-center gap-1.5">
        <kbd className="rounded border border-slate-600/60 bg-slate-900/70 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
          {shortcut.keys}
        </kbd>
        {shortcut.action}
      </span>
    ))}
  </p>
);
