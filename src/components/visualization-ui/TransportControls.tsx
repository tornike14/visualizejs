"use client";

import { useState, useCallback } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import { Tooltip } from "./Tooltip";

export type PlaybackSpeedLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface TransportControlsProps {
  isPlaying: boolean;
  canStep: boolean;
  canStepBack: boolean;
  stepIndex?: number;
  totalSteps?: number;
  speedLevel: PlaybackSpeedLevel;
  speedLabel: string;
  onTogglePlay: () => void;
  onStep: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedLevelChange: (level: PlaybackSpeedLevel) => void;
  className?: string;
}

const SPEED_OPTIONS: { level: PlaybackSpeedLevel; label: string }[] = [
  { level: 1, label: "0.25x" },
  { level: 2, label: "0.5x" },
  { level: 3, label: "0.75x" },
  { level: 4, label: "1x" },
  { level: 5, label: "1.5x" },
  { level: 6, label: "2x" },
];

const iconBtnBase =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border p-2 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0";

const iconBtnDefault =
  "border-slate-600/85 bg-slate-900/65 text-slate-100 hover:border-slate-500";

const iconBtnPrimary =
  "border-amber-300/45 bg-gradient-to-br from-amber-500/30 to-violet-400/18 text-slate-100 hover:border-amber-300/70 hover:shadow-[0_0_16px_rgba(251,191,36,0.2)]";

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
  className,
}: TransportControlsProps) {
  const [speedOpen, setSpeedOpen] = useState(false);
  const handleSpeedClose = useCallback(() => setSpeedOpen(false), []);
  const speedRef = useClickOutside<HTMLDivElement>(speedOpen, handleSpeedClose);
  const showStepPill = stepIndex != null && totalSteps != null;
  const normalizedStepIndex = stepIndex ?? -1;
  const normalizedTotalSteps = totalSteps ?? 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {showStepPill && (
        <p
          aria-live="polite"
          className="app-surface-subtle inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs text-slate-300"
        >
          {isPlaying ? <span className="viz-pulse-dot" /> : null}
          Step {Math.max(normalizedStepIndex + 1, 0)} / {normalizedTotalSteps}
        </p>
      )}

      {/* Reset */}
      <Tooltip label="Reset">
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
      <Tooltip label="Step Back">
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
      <Tooltip label={isPlaying ? "Pause" : "Play"}>
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
      <Tooltip label="Step Forward">
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
        <Tooltip label="Playback Speed">
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


function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
      <path d="M4 2.5v11l8.5-5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
      <path d="M3.5 2h3v12h-3zM9.5 2h3v12h-3z" />
    </svg>
  );
}

function StepIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
      <path d="M2.5 2.5v11L9.5 8zM11 2h2.5v12H11z" />
    </svg>
  );
}

function StepBackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
      <path d="M13.5 2.5v11L6.5 8zM5 2H2.5v12H5z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
      <path d="M8 1.5A6.5 6.5 0 1014.5 8 6.5 6.5 0 008 1.5zm0 1.5A5 5 0 113 8 5 5 0 018 3zm-.75 1.5h1.5v3.25H11v1.5H7.25z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-3 text-slate-400 transition-transform duration-200", open && "rotate-180")}
    >
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
