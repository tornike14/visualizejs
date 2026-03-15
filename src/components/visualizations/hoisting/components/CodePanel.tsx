import { ArrowUp, AlertTriangle } from "lucide-react";
import { NeonPanel, type NeonTone } from "@/components/visualization-ui/NeonPanel";
import { CodeLine as CodeLineComponent } from "@/components/visualization-ui/CodeLine";
import { cn } from "@/lib/utils";
import type { CodeLine, HoistedLine } from "../types";

interface CodePanelProps {
  title: string;
  tone: NeonTone;
  lines: (CodeLine | HoistedLine)[];
  highlightIds: string[];
  floatingIds: string[];
  tdzIds: string[];
}

export const CodePanel = ({
  title,
  tone,
  lines,
  highlightIds,
  floatingIds,
  tdzIds,
}: CodePanelProps) => {
  return (
    <NeonPanel
      title={title}
      tone={tone}
      bodyClassName="overflow-auto font-mono text-[13px] leading-[1.9] text-slate-200"
    >
      <div className="space-y-0.5">
        {lines.map((line, idx) => {
          const isHighlighted = highlightIds.includes(line.id);
          const isFloating = floatingIds.includes(line.id);
          const isInTDZ = tdzIds.includes(line.id);

          const icon = isFloating ? (
            <ArrowUp className="viz-float-up h-3.5 w-3.5 text-emerald-300" />
          ) : isInTDZ ? (
            <AlertTriangle className="h-3.5 w-3.5 text-rose-300" />
          ) : null;

          const lineClass = cn(
            isFloating && "viz-float-up is-floating",
            isInTDZ && "is-tdz",
            isHighlighted && !isInTDZ && !isFloating && "is-highlighted",
          );

          return (
            <CodeLineComponent
              key={`${line.id}-${idx}`}
              lineNumber={idx + 1}
              text={"  ".repeat(line.indent) + line.text}
              leftSlot={icon}
              className={lineClass}
            />
          );
        })}
      </div>
    </NeonPanel>
  );
};
