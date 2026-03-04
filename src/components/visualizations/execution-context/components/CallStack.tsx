import type { ExecutionContextEntry, ScopeLink } from "../types";
import { ecFingerprint } from "../helpers";
import { ECCard } from "./ECCard";

/** The full execution context stack */
export function CallStack({
  stack,
  scopeLinks,
}: {
  stack: ExecutionContextEntry[];
  scopeLinks: ScopeLink[];
}) {
  if (stack.length === 0) {
    return (
      <p className="py-6 text-center font-mono text-xs uppercase tracking-[0.22em] text-slate-500/60">
        empty stack
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {stack.map((ec, index) => {
        const isTop = index === 0;
        const link = scopeLinks.find((l) => l.from === ec.id);
        const showArrow = index < stack.length - 1;

        return (
          <ECCard
            key={`${ec.id}-${ecFingerprint(ec)}`}
            ec={ec}
            isTop={isTop}
            scopeLink={link}
            showArrow={showArrow}
          />
        );
      })}
    </div>
  );
}
