import { cn } from "@/lib/utils";
import type { CreateElementCall } from "../types";

export function CreateElementPanel({ calls }: { calls: CreateElementCall[] }) {
  if (calls.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no calls yet
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {calls.map((call) => (
        <div
          key={call.id}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs",
            call.highlight
              ? "border-violet-500/30 bg-violet-500/8 text-violet-300"
              : "border-slate-500/30 bg-slate-500/8 text-slate-400",
          )}
        >
          <code>{call.code}</code>
        </div>
      ))}
    </div>
  );
}
