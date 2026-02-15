import { useMemo, type ReactNode } from "react";
import { tokenize, type Token } from "@/lib/visualization/syntax";
import { CodeLine } from "./CodeLine";
import { cn } from "@/lib/utils";

export interface CodeBlockLine {
  key: string | number;
  lineNumber?: number;
  text: string;
  className?: string;
  leftSlot?: ReactNode;
}

interface CodeBlockProps {
  lines: CodeBlockLine[];
  className?: string;
}

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
