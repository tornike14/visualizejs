import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type HooksKind = "linked-list" | "order-violation";

export type HookType = "useState" | "useEffect" | "useRef" | "useMemo";

export type HookNodeStatus = "idle" | "creating" | "reading" | "mounted" | "error";

export interface HookNode {
  index: number;
  hookType: HookType;
  memoizedState: string;
  status: HookNodeStatus;
}

export interface FiberHookState {
  fiberLabel: string;
  memoizedStatePointer: number | null;
  hookCount?: number;
  currentHookIndex?: number | null;
}

export interface HooksStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  hookNodes: HookNode[];
  fiberState: FiberHookState;
  errorMessage?: string;
}

export interface HooksExample extends ExampleOption {
  kind: HooksKind;
  codeLines: SourceLine[];
  steps: HooksStep[];
}
