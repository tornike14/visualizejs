import { NeonPanel } from "./NeonPanel";
import {
  VISUALIZATION_PANEL_TITLES,
  VISUALIZATION_EMPTY_STATES,
} from "@/lib/visualization/uiCopy";
import { cn } from "@/lib/utils";

interface ConsoleOutputProps {
  lines: string[];
  className?: string;
}

/**
 * Shared Console Output panel used by all visualizations.
 * Renders inside a slate NeonPanel with a `›` prefix per line.
 */
export function ConsoleOutput({ lines, className }: ConsoleOutputProps) {
  return (
    <NeonPanel
      title={VISUALIZATION_PANEL_TITLES.consoleOutput}
      tone="slate"
      bodyClassName={cn(
        "min-h-[5.8rem] space-y-1.5 font-mono text-xs text-slate-300",
        className,
      )}
    >
      {lines.length === 0 ? (
        <p className="pt-1 text-slate-500/70">
          {VISUALIZATION_EMPTY_STATES.consoleOutput}
        </p>
      ) : (
        lines.map((line, index) => {
          const isError =
            line.startsWith("ReferenceError") ||
            line.startsWith("TypeError") ||
            line.startsWith("SyntaxError");

          return (
            <div
              key={`${line}-${index}`}
              className={cn(
                "console-line",
                isError && "text-red-300",
              )}
            >
              <span className="console-prefix">›</span>
              {line}
            </div>
          );
        })
      )}
    </NeonPanel>
  );
}
