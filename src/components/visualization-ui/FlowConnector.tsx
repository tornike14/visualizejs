import { cn } from "@/lib/utils";

export type FlowTone =
  | "cyan"
  | "emerald"
  | "pink"
  | "amber"
  | "violet"
  | "slate";

interface FlowConnectorProps {
  orientation?: "horizontal" | "vertical";
  /** Animate dots along the track. Off shows a faint static track. */
  active?: boolean;
  /** Run the dots from end to start. */
  reverse?: boolean;
  tone?: FlowTone;
  className?: string;
}

const TONE_CLASSES: Record<FlowTone, string> = {
  cyan: "text-cyan-300",
  emerald: "text-emerald-300",
  pink: "text-pink-300",
  amber: "text-amber-300",
  violet: "text-violet-300",
  slate: "text-slate-500",
};

/**
 * Dotted track between two nodes with glowing dots that travel along it
 * while `active`. The track takes its colour from `tone`; size it with
 * width or height classes (for example `w-6` or `h-4`).
 */
export const FlowConnector = ({
  orientation = "horizontal",
  active = false,
  reverse = false,
  tone = "slate",
  className,
}: FlowConnectorProps) => (
  <span
    aria-hidden
    className={cn(
      "viz-flow",
      orientation === "vertical" ? "viz-flow--v" : "viz-flow--h",
      active && "viz-flow--active",
      reverse && "viz-flow--reverse",
      TONE_CLASSES[tone],
      className,
    )}
  >
    <span className="viz-flow-dot" />
    <span className="viz-flow-dot" />
  </span>
);
