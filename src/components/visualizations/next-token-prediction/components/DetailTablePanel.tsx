import { cn } from "@/lib/utils";
import type { DetailTable } from "../types";
import { TABLE_ROW_STYLES } from "../helpers";

interface DetailTablePanelProps {
  table: DetailTable | null;
  emptyLabel: string;
}

export const DetailTablePanel = ({
  table,
  emptyLabel,
}: DetailTablePanelProps) => {
  if (!table || table.rows.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-mono text-xs">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            {table.columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={cn(
                  "border-b border-slate-700/60 pb-1.5 font-semibold",
                  index === 0 ? "text-left" : "text-right",
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr
              key={row.cells.join("|")}
              className={cn(
                "viz-slide-in border-b border-slate-800/60 last:border-b-0",
                TABLE_ROW_STYLES[row.tone ?? "neutral"],
              )}
            >
              {row.cells.map((cell, index) => (
                <td
                  key={`${index}-${cell}`}
                  className={cn(
                    "whitespace-nowrap py-1.5 tabular-nums",
                    index === 0 ? "pr-3 text-left" : "pl-3 text-right",
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
