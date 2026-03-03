import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PreviewShellProps {
  children: ReactNode;
  className?: string;
}

export const PreviewShell = ({ children, className }: PreviewShellProps) => {
  return (
    <div
      className={cn(
        "relative min-h-[14rem] overflow-hidden rounded-2xl border border-slate-600/75 bg-[linear-gradient(180deg,rgba(13,22,43,0.96),rgba(9,15,30,0.96))] p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.08)] lg:min-h-[15rem] lg:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
};
