import { cn } from "@/lib/utils";
import { ROW_STYLES } from "../helpers";
import type { TablePage } from "../types";

const rowFingerprint = (page: TablePage) =>
  page.rows.map((row) => `${row.id}:${row.state}`).join(",");

export const TablePages = ({ pages }: { pages: TablePage[] }) => {
  if (pages.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {pages.map((page) => (
        <div
          key={`${page.id}-${rowFingerprint(page)}`}
          className="viz-slide-in rounded-lg border border-slate-700/50 bg-slate-900/30 p-1.5"
        >
          <p className="mb-1 px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            {page.label}
          </p>
          <ul className="space-y-1">
            {page.rows.map((row) => (
              <li
                key={row.id}
                className={cn(
                  "flex items-center gap-1.5 overflow-hidden rounded-md border px-1.5 py-0.5 font-mono text-[11px] transition-colors duration-300",
                  ROW_STYLES[row.state],
                )}
                title={row.key}
              >
                <span className="shrink-0 text-[10px] opacity-60">
                  #{row.id}
                </span>
                <span className="truncate">{row.key}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
