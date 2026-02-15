import type { ReactNode } from "react";
import { tokenize, TOKEN_CLASS_MAP, type Token } from "@/lib/visualization/syntax";
import { cn } from "@/lib/utils";

interface CodeLineProps {
  lineNumber?: number;
  text: string;
  tokens?: Token[];
  className?: string;
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
