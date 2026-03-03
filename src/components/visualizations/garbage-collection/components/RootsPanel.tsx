import { cn } from "@/lib/utils";
import type { GCRoot } from "../types";
import { ROOT_TONE_MAP, rootFingerprint } from "../helpers";

export function RootsPanel({ roots }: { roots: GCRoot[] }) {
  if (roots.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no roots
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {roots.map((root) => (
        <div
          key={`${root.id}-${rootFingerprint(root)}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5",
            ROOT_TONE_MAP[root.tone]
          )}
        >
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
            {root.label}
          </span>
          {root.refsTo.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {root.refsTo.map((ref) => (
                <div
                  key={ref}
                  className="font-mono text-xs opacity-70"
                >
                  {'->'} {ref}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
