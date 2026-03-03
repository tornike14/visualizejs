import Link from "next/link";
import { ExpandIcon } from "./SidebarIcons";

export function CollapsedSidebar({ onExpand }: { onExpand: () => void }) {
  return (
    <aside className="app-surface hidden h-screen flex-col items-center bg-[color:var(--app-surface-strong)] lg:sticky lg:top-0 lg:flex lg:w-16 lg:rounded-none lg:border-r lg:border-t-0 lg:border-b-0 lg:border-l-0">
      <div className="flex flex-col items-center gap-4 pt-5">
        <Link
          href="/"
          className="group inline-flex transition-all"
          title="VisualizeJS"
        >
          <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-amber-300 bg-clip-text text-sm font-black tracking-tight text-transparent drop-shadow-[0_0_14px_rgba(34,211,238,0.24)] transition-all group-hover:drop-shadow-[0_0_20px_rgba(244,114,182,0.3)]">
            VJS
          </span>
        </Link>

        <button
          type="button"
          onClick={onExpand}
          title="Expand sidebar"
          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700/40 hover:text-slate-200"
        >
          <ExpandIcon />
        </button>
      </div>
    </aside>
  );
}
