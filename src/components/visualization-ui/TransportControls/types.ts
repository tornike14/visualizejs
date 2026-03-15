export type PlaybackSpeedLevel = 1 | 2 | 3 | 4 | 5 | 6;

type TooltipSide = "top" | "bottom";
type TransportTooltipKey = "reset" | "stepBack" | "play" | "stepForward" | "speed";

export interface TransportTooltipConfig {
  forceVisible?: boolean;
  sides?: Partial<Record<TransportTooltipKey, TooltipSide>>;
}

export interface TransportControlsProps {
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
  tooltipConfig?: TransportTooltipConfig;
  className?: string;
}
