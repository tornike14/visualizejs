"use client";

import { useState, useCallback } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { Tooltip } from "../Tooltip";
import type { TransportControlsProps } from "./types";
import { SPEED_OPTIONS, iconBtnBase, iconBtnDefault, iconBtnPrimary } from "./constants";
import {
  PlayIcon,
  PauseIcon,
  StepIcon,
  StepBackIcon,
  ResetIcon,
  ChevronIcon,
} from "./icons";

export type { PlaybackSpeedLevel } from "./types";

export function TransportControls({
  isPlaying,
  canStep,
  canStepBack,
  stepIndex,
  totalSteps,
  speedLevel,
  speedLabel,
  onTogglePlay,
  onStep,
  onStepBack,
  onReset,
  onSpeedLevelChange,
  tooltipConfig,
  className,
}: TransportControlsProps) {
  const [speedOpen, setSpeedOpen] = useState(false);
  const handleSpeedClose = useCallback(() => setSpeedOpen(false), []);
  const speedRef = useClickOutside<HTMLDivElement>(speedOpen, handleSpeedClose);
  const showStepPill = stepIndex != null && totalSteps != null;
  const normalizedStepIndex = stepIndex ?? -1;
  const normalizedTotalSteps = totalSteps ?? 0;
  const forceVisibleTooltips = tooltipConfig?.forceVisible ?? false;
  const tooltipSides = tooltipConfig?.sides;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {showStepPill && (
        <p
          aria-live="polite"
          className="app-surface-subtle inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs text-slate-300 whitespace-nowrap"
        >
          {isPlaying ? <span className="viz-pulse-dot" /> : null}
          Step {Math.max(normalizedStepIndex + 1, 0)} / {normalizedTotalSteps}
        </p>
      )}

      {/* Reset */}
      <Tooltip
        label="Reset"
        forceVisible={forceVisibleTooltips}
        side={tooltipSides?.reset}
      >
        <button
          type="button"
          aria-label="Reset"
          onClick={onReset}
          className={cn(iconBtnBase, iconBtnDefault)}
        >
          <ResetIcon />
        </button>
      </Tooltip>

      {/* Step Back */}
      <Tooltip
        label="Step Back"
        forceVisible={forceVisibleTooltips}
        side={tooltipSides?.stepBack}
      >
        <button
          type="button"
          aria-label="Step back"
          onClick={onStepBack}
          disabled={!canStepBack}
          className={cn(iconBtnBase, iconBtnDefault)}
        >
          <StepBackIcon />
        </button>
      </Tooltip>

      {/* Play / Pause */}
      <Tooltip
        label={isPlaying ? "Pause" : "Play"}
        forceVisible={forceVisibleTooltips}
        side={tooltipSides?.play}
      >
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={onTogglePlay}
          aria-pressed={isPlaying}
          className={cn(iconBtnBase, iconBtnPrimary, "px-3")}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      </Tooltip>

      {/* Step Forward */}
      <Tooltip
        label="Step Forward"
        forceVisible={forceVisibleTooltips}
        side={tooltipSides?.stepForward}
      >
        <button
          type="button"
          aria-label="Step forward"
          onClick={onStep}
          disabled={!canStep}
          className={cn(iconBtnBase, iconBtnDefault)}
        >
          <StepIcon />
        </button>
      </Tooltip>

      {/* Speed Dropdown */}
      <div ref={speedRef} className="relative">
        <Tooltip
          label="Playback Speed"
          forceVisible={forceVisibleTooltips}
          side={tooltipSides?.speed}
        >
          <button
            type="button"
            aria-label={`Playback speed: ${speedLabel}`}
            aria-haspopup="listbox"
            aria-expanded={speedOpen}
            onClick={() => setSpeedOpen((v) => !v)}
            className={cn(
              iconBtnBase,
              iconBtnDefault,
              "gap-1 px-2.5 font-mono text-xs",
              speedOpen && "ring-2 ring-pink-300/50"
            )}
          >
            <span>{speedLabel}</span>
            <ChevronIcon open={speedOpen} />
          </button>
        </Tooltip>

        {speedOpen && (
          <div
            role="listbox"
            aria-label="Playback speed"
            className="app-surface absolute right-0 top-full z-50 mt-1.5 min-w-[5.5rem] overflow-hidden rounded-xl border-[color:var(--app-border)] p-1 shadow-[0_12px_28px_rgba(2,6,23,0.5)]"
          >
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.level}
                type="button"
                role="option"
                aria-selected={opt.level === speedLevel}
                onClick={() => {
                  onSpeedLevelChange(opt.level);
                  setSpeedOpen(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center rounded-lg px-3 py-1.5 font-mono text-xs transition-colors",
                  opt.level === speedLevel
                    ? "bg-pink-400/15 text-pink-300"
                    : "text-slate-300 hover:bg-slate-700/50 hover:text-slate-100"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
