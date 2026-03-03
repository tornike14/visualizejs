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
  "inline-flex cursor-pointer items-center justify-center rounded-lg border p-2 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70";

export function SandboxToggle({
  isActive,
  onToggle,
  tooltipForceVisible = false,
  tooltipSide = "top",
}: SandboxToggleProps) {
  return (
    <Tooltip
      label={isActive ? "Exit Sandbox" : "Try Sandbox"}
      forceVisible={tooltipForceVisible}
      side={tooltipSide}
    >
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          btnBase,
          isActive
            ? "border-red-400/45 bg-gradient-to-br from-red-500/25 to-rose-400/15 text-red-200 hover:border-red-400/70 hover:shadow-[0_0_16px_rgba(248,113,113,0.2)]"
            : "border-slate-600/85 bg-slate-900/65 text-slate-100 hover:border-slate-500",
        )}
        aria-label={isActive ? "Exit Sandbox" : "Try Sandbox"}
        aria-pressed={isActive}
      >
        {isActive ? <X className="h-4 w-4" /> : <Code2 className="h-4 w-4" />}
      </button>
    </Tooltip>
  );
}
