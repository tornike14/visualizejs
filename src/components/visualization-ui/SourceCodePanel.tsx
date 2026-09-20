import { useMemo } from "react";
import {
  CodeBlock,
  type CodeBlockLine,
} from "@/components/visualization-ui/CodeBlock";
import {
  NeonPanel,
  type NeonTone,
} from "@/components/visualization-ui/NeonPanel";
import { cn } from "@/lib/utils";
import { VISUALIZATION_PANEL_TITLES } from "@/lib/visualization/uiCopy";
import type { SourceLine } from "@/types/visualization";

interface SourceCodePanelProps {
  lines: readonly SourceLine[];
  activeLine?: number | null;
  doneLines?: readonly number[];
  /** Lines to call out that are neither active nor done. */
  highlightLines?: readonly number[];
  title?: string;
  tone?: NeonTone;
  className?: string;
}

const EMPTY: readonly number[] = [];

/**
 * The Source Code panel every step-driven topic shows on the left. Line
 * classes are derived once per step; the active line never fades even when
 * it also appears in doneLines.
 */
export const SourceCodePanel = ({
  lines,
  activeLine = null,
  doneLines = EMPTY,
  highlightLines = EMPTY,
  title = VISUALIZATION_PANEL_TITLES.sourceCode,
  tone = "amber",
  className,
}: SourceCodePanelProps) => {
  const codeLines = useMemo<CodeBlockLine[]>(() => {
    const done = new Set(doneLines);
    const highlighted = new Set(highlightLines);
    return lines.map((line) => {
      const isActive = activeLine === line.num;
      const isDone = done.has(line.num);
      return {
        key: line.num,
        lineNumber: line.num,
        text: line.text,
        className: cn(
          isActive && "is-active",
          isDone && !isActive && "is-done",
          highlighted.has(line.num) && !isActive && !isDone && "is-highlighted",
        ),
      };
    });
  }, [lines, activeLine, doneLines, highlightLines]);

  return (
    <NeonPanel
      title={title}
      tone={tone}
      className={className}
      bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
    >
      <CodeBlock lines={codeLines} />
    </NeonPanel>
  );
};
