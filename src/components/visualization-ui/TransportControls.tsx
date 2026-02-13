import { cn } from "@/lib/utils";

export type PlaybackSpeedLevel = 1 | 2 | 3 | 4 | 5;

interface TransportControlsProps {
  isPlaying: boolean;
  canStep: boolean;
  speedLevel: PlaybackSpeedLevel;
  speedLabel: string;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedLevelChange: (level: PlaybackSpeedLevel) => void;
  className?: string;
}

const rangeMin = 1;
const rangeMax = 5;

function toSpeedLevel(value: number): PlaybackSpeedLevel {
  if (value <= 1) return 1;
  if (value === 2) return 2;
  if (value === 3) return 3;
  if (value === 4) return 4;
  return 5;
}

export function TransportControls({
  isPlaying,
  canStep,
  speedLevel,
  speedLabel,
  onTogglePlay,
  onStep,
  onReset,
  onSpeedLevelChange,
  className,
}: TransportControlsProps) {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      <button
        type="button"
        onClick={onTogglePlay}
        className="inline-flex items-center gap-2 rounded-xl border border-amber-300/45 bg-gradient-to-br from-amber-500/30 to-violet-400/18 px-4 py-2 font-mono text-sm font-medium text-slate-100 transition-all hover:-translate-y-0.5 hover:border-amber-300/70 hover:shadow-[0_0_16px_rgba(251,191,36,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/70"
        aria-pressed={isPlaying}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button
        type="button"
        onClick={onStep}
        disabled={!canStep || isPlaying}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-600/85 bg-slate-900/65 px-4 py-2 font-mono text-sm font-medium text-slate-100 transition-all hover:-translate-y-0.5 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <StepIcon />
        Step
      </button>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-600/85 bg-slate-900/65 px-4 py-2 font-mono text-sm font-medium text-slate-100 transition-all hover:-translate-y-0.5 hover:border-slate-500"
      >
        <ResetIcon />
        Reset
      </button>

      <label className="ml-1 inline-flex items-center gap-2 font-mono text-sm text-slate-300">
        <span>Speed:</span>
        <input
          type="range"
          min={rangeMin}
          max={rangeMax}
          value={speedLevel}
          onChange={(event) =>
            onSpeedLevelChange(toSpeedLevel(Number(event.currentTarget.value)))
          }
          aria-label="Playback speed"
          className="h-1.5 w-24 cursor-pointer rounded-lg bg-slate-700"
          style={{ accentColor: "#f472b6" }}
        />
        <span className="w-8 text-right text-slate-200">{speedLabel}</span>
      </label>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
      <path d="M4 2.5v11l8.5-5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
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

function ResetIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
      <path d="M8 1.5A6.5 6.5 0 1014.5 8 6.5 6.5 0 008 1.5zm0 1.5A5 5 0 113 8 5 5 0 018 3zm-.75 1.5h1.5v3.25H11v1.5H7.25z" />
    </svg>
  );
}
