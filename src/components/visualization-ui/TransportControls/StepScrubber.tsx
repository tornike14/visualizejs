"use client";

import { Tooltip } from "../Tooltip";

interface StepScrubberProps {
  stepIndex: number;
  totalSteps: number;
  onJumpTo: (index: number) => void;
}

/**
 * Range input that maps to step indexes. Keeping it a native input gives
 * keyboard access and screen reader support for free.
 */
export const StepScrubber = ({
  stepIndex,
  totalSteps,
  onJumpTo,
}: StepScrubberProps) => {
  const max = totalSteps - 1;
  const value = Math.max(stepIndex, 0);
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <Tooltip label="Jump to step">
      <label className="viz-scrubber inline-flex items-center px-1">
        <span className="sr-only">Jump to step</span>
        <input
          type="range"
          min={0}
          max={max}
          step={1}
          value={value}
          aria-valuetext={`Step ${value + 1} of ${totalSteps}`}
          onChange={(event) => onJumpTo(Number(event.target.value))}
          style={{ "--scrubber-fill": `${percent}%` } as React.CSSProperties}
        />
      </label>
    </Tooltip>
  );
};
