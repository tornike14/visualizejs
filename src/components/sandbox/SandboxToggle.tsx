"use client";

import { Code2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/visualization-ui/Tooltip";

interface SandboxToggleProps {
  isActive: boolean;
  onToggle: () => void;
  tooltipForceVisible?: boolean;
  tooltipSide?: "top" | "bottom";
}

const btnBase =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70";

export function SandboxToggle({
  isActive,
  onToggle,
  tooltipForceVisible = false,
  tooltipSide = "top",
}: SandboxToggleProps) {
  return (
    <Tooltip
      label={isActive ? "Exit Sandbox" : "Write and run your own code"}
      forceVisible={tooltipForceVisible}
      side={tooltipSide}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          btnBase,
          isActive
            ? "border-rose-400/45 bg-gradient-to-br from-rose-500/25 to-rose-400/15 p-2 text-rose-200 hover:border-rose-400/70 hover:shadow-[0_0_16px_rgba(248,113,113,0.2)]"
            : "gap-1.5 border-amber-400/40 bg-gradient-to-br from-amber-500/20 to-amber-400/10 px-3 py-2 text-amber-200 hover:border-amber-400/60 hover:shadow-[0_0_12px_rgba(251,191,36,0.15)]",
        )}
        aria-label={isActive ? "Exit Sandbox" : "Try Sandbox"}
        aria-pressed={isActive}
      >
        {isActive ? (
          <X className="h-4 w-4" />
        ) : (
          <>
            <Code2 className="h-4 w-4" />
            <span className="text-xs font-medium">Sandbox</span>
          </>
        )}
      </button>
    </Tooltip>
  );
}
