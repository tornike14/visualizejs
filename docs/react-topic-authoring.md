# React Topic Authoring Guide

Extensions for building React visualization topics. This guide assumes you have read the base [topic-authoring.md](topic-authoring.md) workflow (registration, route page, checklist). For component APIs and hooks, see [component-reference.md](component-reference.md).

---

## Table of Contents

1. [ComponentTreeDiagram](#componenttreediagram)
2. [React Topic File Structure](#react-topic-file-structure)
3. [React Category Registration](#react-category-registration)
4. [Checklist](#checklist)

---

## ComponentTreeDiagram

**File:** `src/components/visualization-ui/ComponentTreeDiagram/`

React topics visualize component/element trees instead of linear structures (call stacks, scope chains). The `ComponentTreeDiagram` is a shared reusable component in `visualization-ui/` for this purpose.

### Props

```typescript
interface ComponentTreeDiagramProps {
  tree: TreeNodeData;        // Root node of the tree
  activeNodeId?: string;     // Node highlighted with a cyan ring
}
```

### TreeNodeData

Defined in `src/types/visualization.ts`:

```typescript
export type TreeNodeHighlight = "unchanged" | "updated" | "added" | "removed" | "active";

export interface TreeNodeData {
  id: string;
  label: string;
  props?: { key: string; value: string }[];
  children?: TreeNodeData[];
  highlight?: TreeNodeHighlight;
}
```

### Highlight Color Scheme

| Highlight   | Border/BG   | Text Color  | Use Case                          |
|-------------|-------------|-------------|-----------------------------------|
| `unchanged` | slate       | slate-400   | Nodes that didn't change          |
| `updated`   | amber       | amber-300   | Props or text content changed     |
| `added`     | emerald     | emerald-300 | Newly mounted nodes               |
| `removed`   | rose        | rose-400    | Nodes being unmounted (strikethrough) |
| `active`    | cyan        | cyan-300    | Currently being compared/diffed   |

### Connector Lines (Split-Half Technique)

Tree connectors use a split-half pattern for each child column:
- **First child**: right half of horizontal rail only
- **Middle children**: both left and right halves
- **Last child**: left half only
- **Only child**: neither half (just a vertical drop)

Child columns use `flex` layout edge-to-edge (no gap) so the rail segments connect seamlessly into a continuous horizontal line.

### Auto-Scaling

The component automatically scales down when the tree is wider than its container:
- Uses `ResizeObserver` + `useLayoutEffect` to measure natural width vs container width
- Applies `transform: scale(ratio)` with `transformOrigin: "top center"`
- Adjusts wrapper height to `Math.ceil(naturalHeight * scale)` to prevent layout gaps
- No horizontal scroll ever appears

### NeonPanel Tone Conventions for React Topics

| Panel          | Tone     |
|----------------|----------|
| Source Code    | `amber`  |
| Previous Tree  | `cyan`   |
| New Tree       | `green`  |
| DOM Operations | `violet` |

### Usage in a Visualization

```tsx
import { ComponentTreeDiagram } from "@/components/visualization-ui/ComponentTreeDiagram";

<NeonPanel title="Previous Tree" tone="cyan" bodyClassName="min-h-[10rem]"
  className={flashes.previousTree ? "viz-change-flash" : undefined}
>
  {currentStep ? (
    <ComponentTreeDiagram
      tree={currentStep.previousTree}
      activeNodeId={currentStep.activeNodeId}
    />
  ) : (
    <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
      waiting
    </p>
  )}
</NeonPanel>
```

---

## React Topic File Structure

React topics (and complex JS topics) use a folder-based structure instead of a single file. This keeps visualization data, types, helpers, and sub-components organized.

### Folder Pattern

```
src/components/visualizations/<topic-id>/
  index.tsx          # Main component (exports named function)
  types.ts           # Step, Example, Kind, Operation types
  helpers.ts         # Badge classes, labels, operation styles
  data.ts            # EXAMPLES array with all step-by-step data
  components/        # Sub-components specific to this topic
    DiffPanel.tsx    #   Example: DOM operations panel
```

### Types File

Define your step type, example type, and any enums:

```typescript
import type { SourceLine, TreeNodeData } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type YourKind = "variant-a" | "variant-b" | "variant-c";

export interface YourStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  previousTree: TreeNodeData;
  newTree: TreeNodeData;
  activeNodeId?: string;
  operations: YourOperation[];
}

export interface YourExample extends ExampleOption {
  kind: YourKind;
  codeLines: SourceLine[];
  steps: YourStep[];
}
```

### Helpers File

Use the shared helper factories for consistent badge/label patterns:

```typescript
import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { YourKind } from "./types";

export const kindBadgeClass = createKindBadgeClass<YourKind>({
  "variant-a": "bg-amber-500/15 text-amber-400 border-amber-500/25",
  "variant-b": "bg-rose-500/15 text-rose-400 border-rose-500/25",
  "variant-c": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
});

export const kindLabel = createKindLabel<YourKind>({
  "variant-a": "variant a",
  "variant-b": "variant b",
  "variant-c": "variant c",
});
```

### Main Component Pattern

```typescript
export function YourTopic() {
  const [activeExampleId, setActiveExampleId] = useState(EXAMPLES[0].id);
  const handleExampleChange = (id: string) => setActiveExampleId(id);
  const example = EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];

  const { currentStepIndex, ... } = useStepPlayback({
    totalSteps: example.steps.length,
    initialStep: -1,
    resetKey: activeExampleId,
  });

  const currentStep = currentStepIndex >= 0 ? example.steps[currentStepIndex] : null;
  const flashes = useChangeFlash({
    description: currentStep?.descriptionHtml,
    previousTree: currentStep?.previousTree,
    newTree: currentStep?.newTree,
    operations: currentStep?.operations,
  }, currentStepIndex);

  return (
    <>
      <ToolbarPortal>
        {/* ExampleSelector + Badge + TransportControls + step description pill */}
      </ToolbarPortal>
      <section>
        {/* CodeBlock (amber) | Previous Tree (cyan) + New Tree (green) | DiffPanel (violet) */}
      </section>
    </>
  );
}
```

### Reference Implementation

The **Reconciliation** topic (`src/components/visualizations/reconciliation/`) is the reference implementation for folder-based React topics. Study its structure when building new React visualizations.

---

## React Category Registration

When adding a new React topic, follow these additional steps beyond the base checklist:

1. Register in `src/lib/topics.ts` with `category: "react"` and `route: "/react/<id>"`
2. Create route page at `src/app/react/<id>/page.tsx`
3. Create theory file at `src/content/theory/react/<id>.ts` (if applicable)
4. Add to `SELECTOR_TOOLBAR_TOPIC_IDS` in `VisualizationPageShell.tsx` (if using ExampleSelector)
5. Sitemap updates automatically (category-agnostic), and the theory sections
   render on the topic page once the content is registered

---

## Checklist

React-specific items (in addition to the "All Topics" checklist in [topic-authoring.md](topic-authoring.md)):

- [ ] Route page at `src/app/react/<id>/page.tsx`
- [ ] Topic uses folder-based structure: `types.ts`, `helpers.ts`, `data.ts`, `components/`, `index.tsx`
- [ ] Tree panels use `ComponentTreeDiagram` from `visualization-ui/`
- [ ] Tree panels follow tone conventions: Previous Tree (cyan), New Tree (green)
- [ ] Trees auto-scale properly on narrow viewports (no horizontal scroll)
- [ ] Theory file created at `src/content/theory/react/<id>.ts` (if applicable)
- [ ] Theory registered in `src/content/theory/index.ts`
- [ ] Theory `relatedTopicIds` is populated (not empty array)
