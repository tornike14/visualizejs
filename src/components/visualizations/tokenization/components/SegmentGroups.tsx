import { TokenChips } from "@/components/visualization-ui/TokenChips";
import type { SegmentGroup } from "../types";

interface SegmentGroupsProps {
  groups: SegmentGroup[];
}

export const SegmentGroups = ({ groups }: SegmentGroupsProps) => {
  if (groups.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div
          key={group.id}
          className="grid gap-1.5 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:items-start"
        >
          <span className="pt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            {group.label}
          </span>
          <TokenChips
            chips={group.chips}
            showIndex={group.showIndex}
            emptyLabel="none"
          />
        </div>
      ))}
    </div>
  );
};
