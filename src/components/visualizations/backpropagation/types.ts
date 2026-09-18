import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type BackpropKind = "neuron" | "chain" | "loop";

/** Which direction data is moving through the computation graph. */
export type GraphPhase = "idle" | "forward" | "backward" | "update";

export type GraphNodeStatus = "pending" | "active" | "done";

/** One node of the computation graph, for example "w * x" or "loss". */
export interface GraphNode {
  id: string;
  label: string;
  /** Forward value, null until the forward pass reaches this node. */
  value: string | null;
  /** dL/d(node), null until the backward pass reaches this node. */
  grad: string | null;
  status: GraphNodeStatus;
}

/** One row of the Gradients panel. */
export interface GradientEntry {
  id: string;
  /** For example "dL/dw". */
  label: string;
  /** The chain rule product that produced it, for example "-1.8 * 2.0". */
  formula: string;
  /** Formatted numeric result. */
  display: string;
  active?: boolean;
}

/** One row of the Parameters panel. */
export interface ParameterRow {
  id: string;
  name: string;
  value: string;
  grad: string | null;
  /** Value after the gradient descent step, null until the update runs. */
  next: string | null;
  active?: boolean;
}

/** One bar of the Loss panel. */
export interface LossPoint {
  id: string;
  label: string;
  /** Loss scaled into the 0 to 1 range for the bar width. */
  ratio: number;
  display: string;
  overshoot?: boolean;
  active?: boolean;
}

export interface BackpropStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  phase: GraphPhase;
  graph: GraphNode[];
  gradients: GradientEntry[];
  parameters: ParameterRow[];
  lossHistory: LossPoint[];
}

export interface BackpropExample extends ExampleOption {
  kind: BackpropKind;
  codeLines: SourceLine[];
  steps: BackpropStep[];
}
