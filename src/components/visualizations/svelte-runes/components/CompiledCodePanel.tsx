import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  CodeBlock,
  type CodeBlockLine,
} from "@/components/visualization-ui/CodeBlock";
import { cn } from "@/lib/utils";
import type { SourceLine } from "@/types/visualization";

interface CompiledCodePanelProps {
  lines: SourceLine[];
  activeLine: number | null;
  doneLines: number[];
  flash: boolean;
}

export const CompiledCodePanel = ({
  lines,
  activeLine,
  doneLines,
  flash,
}: CompiledCodePanelProps) => (
  <NeonPanel
    title="Compiled Output"
    tone="violet"
    bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
    className={flash ? "viz-change-flash" : undefined}
  >
    <CodeBlock
      lines={lines.map((line): CodeBlockLine => {
        const isActive = activeLine === line.num;
        const isDone = doneLines.includes(line.num);
        return {
          key: line.num,
          lineNumber: line.num,
          text: line.text,
          className: cn(isActive && "is-active", isDone && !isActive && "is-done"),
        };
      })}
    />
  </NeonPanel>
);
