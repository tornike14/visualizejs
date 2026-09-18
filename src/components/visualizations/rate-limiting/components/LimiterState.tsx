import { MetricBars, type MetricBar } from "@/components/visualization-ui/MetricBars";
import { TokenChips, type TokenChip } from "@/components/visualization-ui/TokenChips";

interface LimiterStateProps {
  bars: MetricBar[];
  chips: TokenChip[];
  note: string;
  started: boolean;
}

export const LimiterState = ({ bars, chips, note, started }: LimiterStateProps) => {
  if (!started) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {bars.length > 0 ? (
        <MetricBars bars={bars} />
      ) : (
        <TokenChips chips={chips} emptyLabel="no timestamps in window" />
      )}
      {note && (
        <p className="font-mono text-[11px] leading-relaxed text-slate-400">
          {note}
        </p>
      )}
    </div>
  );
};
