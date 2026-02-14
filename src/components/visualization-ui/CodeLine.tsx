import type { ReactNode } from "react";
import { tokenize, TOKEN_CLASS_MAP, type Token } from "@/lib/visualization/syntax";
import { cn } from "@/lib/utils";

interface CodeLineProps {
  /** Line number displayed in the gutter. Omit to hide the gutter. */
  lineNumber?: number;
  /** Plain source text for this line. */
  text: string;
  /** Pre-computed tokens. If omitted, `text` is tokenized automatically. */
  tokens?: Token[];
  /** Extra CSS classes on the line container (e.g. "is-active", "is-done"). */
  className?: string;
  /** Optional element rendered in a fixed-width slot before the code (icons, etc.). */
  leftSlot?: ReactNode;
}

function renderTokens(tokens: Token[]) {
  return tokens.map((token, i) => {
    const cls = TOKEN_CLASS_MAP[token.type];
    return cls ? (
      <span key={i} className={cls}>
        {token.value}
      </span>
    ) : (
      <span key={i}>{token.value}</span>
    );
  });
}

export function CodeLine({
  lineNumber,
  text,
  tokens,
  className,
  leftSlot,
}: CodeLineProps) {
  const resolvedTokens = tokens ?? tokenize(text);
  const isEmpty = text === "" || text.trim() === "";

  return (
    <div className={cn("code-line", className)}>
      {lineNumber != null && (
        <span className="code-line-num">{lineNumber}</span>
      )}
      {leftSlot != null && (
        <span className="code-line-icon">{leftSlot}</span>
      )}
      <code className="code-line-content">
        {isEmpty ? "\u00a0" : renderTokens(resolvedTokens)}
      </code>
    </div>
  );
}
