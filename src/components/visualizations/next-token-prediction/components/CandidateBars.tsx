import {
  MetricBars,
  type MetricBar,
} from "@/components/visualization-ui/MetricBars";
import type { CandidateMode, CandidateRow } from "../types";
import { CANDIDATE_MODE_LABELS, CANDIDATE_TONES } from "../helpers";

interface CandidateBarsProps {
  mode: CandidateMode;
  rows: CandidateRow[];
  note: string | null;
}

const rowFingerprint = (row: CandidateRow): string =>
  `${row.token}|${row.display}|${row.status}`;

export const CandidateBars = ({ mode, rows, note }: CandidateBarsProps) => {
  if (rows.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  const bars = rows.map(
    (row): MetricBar => ({
      id: `${row.id}-${rowFingerprint(row)}`,
      label: JSON.stringify(row.token),
      value: row.bar,
      display: row.display,
      tone: CANDIDATE_TONES[row.status],
      active: row.status === "chosen" || row.status === "kept",
    }),
  );

  return (
    <div className="space-y-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {CANDIDATE_MODE_LABELS[mode]}
      </p>
      <MetricBars bars={bars} />
      {note && (
        <p className="border-t border-slate-700/50 pt-2 font-mono text-[11px] text-slate-400">
          {note}
        </p>
      )}
    </div>
  );
};
