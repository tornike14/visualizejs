import { useMemo, type ReactNode } from "react";
import { tokenize, type Token } from "@/lib/visualization/syntax";
import { CodeLine } from "./CodeLine";
import { cn } from "@/lib/utils";

export interface CodeBlockLine {
  /** Unique key for React reconciliation. */
  key: string | number;
  /** Line number displayed in the gutter. */
  lineNumber?: number;
  /** The raw source text. */
  text: string;
  /** Additional class names applied to this specific line. */
  className?: string;
  /** Optional element rendered before the code (icons, indicators). */
  leftSlot?: ReactNode;
}

interface CodeBlockProps {
  lines: CodeBlockLine[];
  className?: string;
}

/**
 * Multi-line code display with syntax highlighting.
 * Bulk-tokenizes all lines via `useMemo`, then delegates to `<CodeLine>`.
 */
export function CodeBlock({ lines, className }: CodeBlockProps) {
  const tokensByLine = useMemo<Token[][]>(
    () => lines.map((line) => tokenize(line.text)),
    [lines]
  );

  return (
    <div className={cn("space-y-0.5", className)}>
      {lines.map((line, index) => (
        <CodeLine
          key={line.key}
          lineNumber={line.lineNumber}
          text={line.text}
          tokens={tokensByLine[index]}
          className={line.className}
          leftSlot={line.leftSlot}
        />
      ))}
    </div>
  );
}
