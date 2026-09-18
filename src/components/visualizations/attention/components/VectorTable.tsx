import { cn } from "@/lib/utils";
import { VECTOR_ROW_STYLES } from "../helpers";
import type { VectorRow } from "../types";

const rowFingerprint = (row: VectorRow) =>
  `${row.tone ?? "neutral"}|${row.cells.map((c) => `${c.label}=${c.value}`).join(",")}`;

/**
 * One row per token, one column per named vector (x, q, k, v). Columns are
 * derived from the first row so examples can add vectors step by step.
 */
export const VectorTable = ({ rows }: { rows: VectorRow[] }) => {
  if (rows.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  const columns = rows[0].cells.map((cell) => cell.label);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-x-0 border-spacing-y-1 font-mono text-[11px]">
        <thead>
          <tr className="text-slate-500">
            <th scope="col" className="px-2 text-left font-semibold">
              token
            </th>
            {columns.map((label) => (
              <th key={label} scope="col" className="px-2 text-left font-semibold">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const style = VECTOR_ROW_STYLES[row.tone ?? "neutral"];
            const last = row.cells.length - 1;
            return (
              <tr
                key={`${row.id}-${rowFingerprint(row)}`}
                className="viz-slide-in"
              >
                <th
                  scope="row"
                  className={cn(
                    "rounded-l-lg border border-r-0 px-2 py-1.5 text-left font-semibold transition-all duration-300",
                    style,
                  )}
                >
                  {row.token}
                </th>
                {row.cells.map((cell, index) => (
                  <td
                    key={cell.label}
                    className={cn(
                      "border-y px-2 py-1.5 tabular-nums transition-all duration-300",
                      index === last && "rounded-r-lg border-r",
                      style,
                    )}
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
