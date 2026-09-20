import type { ReactNode } from "react";
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

export const CodeBlock = ({ lines, className }: CodeBlockProps) => (
  <div className={cn("space-y-0.5 overflow-x-auto", className)}>
    {lines.map((line) => (
      <CodeLine
        key={line.key}
        lineNumber={line.lineNumber}
        text={line.text}
        className={line.className}
        leftSlot={line.leftSlot}
      />
    ))}
  </div>
);
