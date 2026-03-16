import { cn } from "@/lib/utils";

export function DomOutputPanel({ lines }: { lines: string[] }) {
  if (lines.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no output yet
      </p>
    );
  }

  return (
    <div className="space-y-0.5">
      {lines.map((line, index) => {
        const indent = line.length - line.trimStart().length;
        return (
          <div
            key={`${line}-${index}`}
            className={cn(
              "viz-slide-in font-mono text-xs text-emerald-300/90",
            )}
            style={{ paddingLeft: `${indent * 8 + 12}px` }}
          >
            {line.trim()}
          </div>
        );
      })}
    </div>
  );
}
