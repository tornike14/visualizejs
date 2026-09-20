"use client";

import { Pencil, Play, RotateCcw } from "lucide-react";
import { SandboxToggle } from "@/components/sandbox/SandboxToggle";
import { Tooltip } from "@/components/visualization-ui/Tooltip";
import {
  iconBtnBase,
  iconBtnDefault,
} from "@/components/visualization-ui/TransportControls/constants";
import { cn } from "@/lib/utils";

const iconBtnSandbox =
  "border-emerald-300/45 bg-gradient-to-br from-emerald-500/30 to-cyan-400/18 text-emerald-200 hover:border-emerald-300/70 hover:shadow-[0_0_16px_rgba(52,211,153,0.2)]";

interface SandboxControlsProps {
  isActive: boolean;
  isEditing: boolean;
  onToggle: () => void;
  onGenerate: () => void;
  onResetCode: () => void;
  onEdit: () => void;
}

/** Toolbar cluster for sandbox topics: the toggle plus generate, reset, and edit. */
export const SandboxControls = ({
  isActive,
  isEditing,
  onToggle,
  onGenerate,
  onResetCode,
  onEdit,
}: SandboxControlsProps) => (
  <>
    <SandboxToggle isActive={isActive} onToggle={onToggle} />

    {isActive && isEditing && (
      <>
        <Tooltip label="Generate visualization (Cmd+Enter)">
          <button
            type="button"
            onClick={onGenerate}
            className={cn(iconBtnBase, iconBtnSandbox)}
            aria-label="Generate visualization"
          >
            <Play className="h-4 w-4 fill-current" />
          </button>
        </Tooltip>

        <Tooltip label="Reset to default code">
          <button
            type="button"
            onClick={onResetCode}
            className={cn(iconBtnBase, iconBtnDefault)}
            aria-label="Reset code"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </Tooltip>
      </>
    )}

    {isActive && !isEditing && (
      <Tooltip label="Edit code">
        <button
          type="button"
          onClick={onEdit}
          className={cn(iconBtnBase, iconBtnSandbox)}
          aria-label="Edit code"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </Tooltip>
    )}
  </>
);

const KBD_CLASS =
  "mx-0.5 rounded border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-xs";

/** Replaces the step description while the reader is editing sandbox code. */
export const SandboxEditingHint = () => (
  <p className="text-center text-sm text-emerald-300/70">
    Edit the code below and press <kbd className={KBD_CLASS}>Generate</kbd> or{" "}
    <kbd className={KBD_CLASS}>Cmd+Enter</kbd> to visualize.
  </p>
);
