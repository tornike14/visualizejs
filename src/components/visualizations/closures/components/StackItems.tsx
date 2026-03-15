import { cn } from "@/lib/utils";
import { STACK_ITEM_STYLE } from "../helpers";

export const StackItems = ({ items }: { items: string[] }) => {
  if (items.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={`${item}-${index}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs",
            STACK_ITEM_STYLE
          )}
        >
          {item}
        </div>
      ))}
    </div>
  );
};
