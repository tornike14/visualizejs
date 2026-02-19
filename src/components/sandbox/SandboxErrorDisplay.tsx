"use client";

import { AlertTriangle, XCircle } from "lucide-react";
import type { SandboxError } from "@/types/sandbox";

interface SandboxErrorDisplayProps {
  error: SandboxError;
  supportedPatterns?: string[];
}

export function SandboxErrorDisplay({ error, supportedPatterns }: SandboxErrorDisplayProps) {
  const isParseError = error.type === "parse-error";

  return (
    <div
      className={`mt-2 overflow-hidden rounded-lg border px-3 py-2 text-xs ${
        isParseError
          ? "border-red-400/30 bg-red-400/5 text-red-300"
          : "border-amber-400/30 bg-amber-400/5 text-amber-300"
      }`}
    >
      <div className="flex items-start gap-2">
        {isParseError ? (
          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        )}
        <div className="min-w-0 break-words">
          <p className="font-medium">
            {error.message}
            {error.line != null && (
              <span className="ml-1 opacity-60">
                (line {error.line}
                {error.column != null ? `, col ${error.column}` : ""})
              </span>
            )}
          </p>

          {error.type === "unsupported-pattern" && supportedPatterns && supportedPatterns.length > 0 && (
            <details className="mt-1.5 text-[11px] opacity-75">
              <summary className="cursor-pointer font-medium">Supported patterns</summary>
              <ul className="mt-0.5 list-inside list-disc space-y-0.5 pl-1">
                {supportedPatterns.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
