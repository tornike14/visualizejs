import { memo, type ReactNode } from "react";
import { tokenize, TOKEN_CLASS_MAP } from "@/lib/visualization/syntax";
import { cn } from "@/lib/utils";

interface CodeLineProps {
  lineNumber?: number;
  text: string;
  className?: string;
  leftSlot?: ReactNode;
}

const renderTokens = (text: string) =>
  tokenize(text).map((token, index) => {
    const tokenClass = TOKEN_CLASS_MAP[token.type];
    return tokenClass ? (
      <span key={index} className={tokenClass}>
        {token.value}
      </span>
    ) : (
      <span key={index}>{token.value}</span>
    );
  });

/**
 * One highlighted source line. Memoized because a step change only touches
 * the className of a couple of lines while the rest of the block is stable.
 */
export const CodeLine = memo(
  ({ lineNumber, text, className, leftSlot }: CodeLineProps) => {
    const isEmpty = text.trim() === "";

    return (
      <div className={cn("code-line", className)}>
        {lineNumber != null && (
          <span className="code-line-num">{lineNumber}</span>
        )}
        {leftSlot != null && <span className="code-line-icon">{leftSlot}</span>}
        <code className="code-line-content">
          {isEmpty ? " " : renderTokens(text)}
        </code>
      </div>
    );
  },
);

CodeLine.displayName = "CodeLine";
