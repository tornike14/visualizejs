# Topic Authoring Guide

How to wire a new JavaScript visualization topic into VisualizeJS. For React-specific extensions, see [react-topic-authoring.md](react-topic-authoring.md). For reusable components, hooks, and animations, see [component-reference.md](component-reference.md).

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Step 1 - Register the Topic](#step-1--register-the-topic)
4. [Step 2 - Register the Component](#step-2--register-the-component)
5. [Step 3 - Build the Visualization Component](#step-3--build-the-visualization-component)
6. [Toolbar Portal Pattern](#toolbar-portal-pattern)
7. [Step Data Modeling](#step-data-modeling)
8. [UI Copy Constants](#ui-copy-constants)
9. [Checklist](#checklist)

---

## Architecture Overview

```
AppTheme  (dark background, gradient overlays, noise texture)
  Sidebar  (collapsible topic navigation)
  main
    VisualizationPageShell  (ToolbarProvider + back link, title + docs link)
      divider
      ToolbarSlot  <-- controls + explanation pill render here via portal
      surface-card
        ErrorBoundary
          <YourVisualization />  (dynamically imported, "use client")
            ToolbarPortal  <-- hoists toolbar content to the slot above
```

Every visualization is a self-contained `"use client"` component that receives no props. It owns its step data, layout, and rendering. The shell provides the page chrome (heading, back link, external docs link, card surface).

The page title is followed by a small external-link icon that opens the topic's authoritative documentation (e.g., MDN). A thin divider line separates the header from the content below.

Transport controls and the step explanation pill are rendered _outside_ the surface card via the `ToolbarPortal` pattern. This frees vertical space inside the card for the actual visualization panels.

Data flow: **hardcoded EXAMPLES or STEPS array** -> **useExampleTopic / useStepPlayback** -> **currentStep** -> **conditional rendering**.

Routing is generated: `src/app/[category]/[topic]/page.tsx` looks the topic up in the registry and renders the component from `VISUALIZATIONS`. There is no per-topic page file.

---

## Directory Structure

```
src/
  app/
    [category]/
      page.tsx                     # Category index (generated for every category)
      layout.tsx                   # Mounts the onboarding tour
      [topic]/page.tsx             # Topic page (generated for every topic)
  components/
    visualizations/
      registry.tsx                  # VISUALIZATIONS: topic id -> lazy component (Step 2)
      your-topic/                   # One folder per topic
        index.tsx                   #   Main component
        types.ts                    #   Step, Example, Kind types
        helpers.ts                  #   Badge classes, labels, operation styles
        data.ts                     #   EXAMPLES array with step data
        components/                 #   Sub-components (DiffPanel, etc.)
    visualization-ui/
      CodeBlock.tsx                 # Multi-line syntax-highlighted code
      CodeLine.tsx                  # Single line with gutter + tokens
      ComponentTreeDiagram/         # Recursive tree visualization (React topics)
        index.tsx                   #   Main component with auto-scaling
        TreeNode.tsx                #   Recursive tree node renderer
        styles.ts                   #   Highlight, label, and connector style maps
      ConsoleOutput.tsx             # Shared console panel
      ExampleSelector.tsx           # Dropdown for switching sub-examples
      ExamplePicker.tsx             # ExampleSelector + active kind badge
      SourceCodePanel.tsx           # Source Code panel with active/done line states
      VisualizationToolbar.tsx      # Transport controls + step pill, portaled above the card
      VisualizationLayout.tsx       # VisualizationSection, SourceGrid, WaitingPlaceholder
      NeonPanel.tsx                 # Themed container with tones
      PipelineDiagram.tsx           # Ordered stages with an active one
      TokenChips.tsx                # Row of labelled chips
      HeatmapGrid.tsx               # Matrix with colour intensity
      MetricBars.tsx                # Labelled horizontal bars
      MessageFlow.tsx               # Actors and ordered messages
      TopicLink.tsx                 # Cross-topic navigation link
      TransportControls/            # Playback buttons + speed dropdown
        index.tsx                   #   Main component
        types.ts                    #   PlaybackSpeedLevel, props interfaces
        constants.ts                #   Speed options, button style classes
        icons.tsx                   #   Play, Pause, Step, Reset, Chevron icons
      Tooltip.tsx                   # Lightweight hover tooltip
    layout/
      VisualizationPageShell.tsx    # Page wrapper with ToolbarSlot
      ToolbarPortal.tsx             # Provider, Slot, and Portal components
      Sidebar.tsx                   # Navigation sidebar
      AppTheme.tsx                  # Global theme wrapper
  hooks/
    useStepPlayback.ts              # Shared playback engine (keyboard shortcuts, progress)
    useTopicProgress.ts             # Completed-topic state from localStorage
    useChangeFlash.ts               # Detects per-channel data changes between steps
    useClickOutside.ts              # Outside-click + Escape dismiss hook
  lib/
    categories.ts                   # Category registry (labels, routes, colours)
    topics.ts                       # Topic registry
    constants.ts                    # Site-wide constants
    metadata.ts                     # SEO metadata factory
    visualization/
      syntax.ts                     # JS tokenizer + token-to-class map
      uiCopy.ts                     # Shared UI strings
    visualization-helpers.ts        # createKindBadgeClass, createKindLabel
  types/
    index.ts                        # Topic, Category, Difficulty types
    visualization.ts                # SourceLine, TreeNodeData, TreeNodeHighlight, ChainHighlight
```

---

## Step 1 - Register the Topic

**File:** `src/lib/topics.ts`

Add an entry to `TOPIC_DEFINITIONS`:

```typescript
{
  id: "closures",
  title: "Closures",
  category: "javascript",
  description: "See how closures capture variables from their lexical scope.",
  difficulty: "intermediate",
  docsUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
  toolbar: "simple", // only for topics without an example picker
}
```

The array is `as const`, so the new id joins the `TopicId` union. From that point `npm run typecheck` fails until the component, theory, keyword, and description registries all have an entry for it.

**Fields:**

| Field         | Type                                                              | Notes                                                                                                            |
| ------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `id`          | `string`                                                          | URL slug and registry key (`TopicId`)                                                                            |
| `title`       | `string`                                                          | Shown in sidebar + page heading                                                                                  |
| `category`    | `Category` (`javascript`, `react`, `frameworks`, `backend`, `ai`) | Sidebar group, route prefix, colours. See [categories.md](categories.md)                                         |
| `description` | `string`                                                          | Used for SEO metadata and category landing page cards (not shown on visualization page)                          |
| `difficulty`  | `"beginner" \| "intermediate" \| "advanced"`                      | Badge color in sidebar                                                                                           |
| `docsUrl`     | `string`                                                          | External URL to authoritative documentation (MDN, React docs, etc.). Shown as a link icon next to the page title |
| `toolbar`     | `"selector" \| "simple"` (optional)                               | Skeleton shown while the toolbar mounts. Defaults to `selector`; set `simple` when there is no example picker    |

**Types** are defined in `src/types/index.ts`:

```typescript
export type Category = "javascript" | "react" | "frameworks" | "backend" | "ai";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export interface TopicDefinition {
  id: string;
  title: string;
  category: Category;
  description: string;
  difficulty: Difficulty;
  docsUrl: string;
  toolbar?: "selector" | "simple";
}
export interface Topic extends TopicDefinition {
  route: string; // derived: `/${category}/${id}`
}
```

---

## Step 2 - Register the Component

**File:** `src/components/visualizations/registry.tsx`

Add one entry to `VISUALIZATIONS`, keyed by the topic id:

```typescript
"closures": dynamic(
  () => import("./closures").then((module) => module.Closures),
  { loading },
),
```

That is the whole routing step. `src/app/[category]/[topic]/page.tsx` calls `generateStaticParams` over the topic registry, builds metadata with `createTopicMetadata`, and renders `VISUALIZATIONS[topic.id]` inside `VisualizationPageShell`. `dynamic()` keeps each topic in its own chunk.

---

## Step 3 - Build the Visualization Component

**File:** `src/components/visualizations/closures/index.tsx`

### Skeleton

Most topics have several examples and use `useExampleTopic`. Split the pieces across `types.ts`, `data.ts`, `helpers.ts`, and `index.tsx` as in the directory structure above.

```typescript
// types.ts
import type { BaseStep, SourceExample } from "@/types/visualization";

export type ClosureKind = "counter" | "loop";

export interface ClosureStep extends BaseStep {
  consoleOutput: string[];
  scope: ScopeEntry[];
  // ... topic-specific fields
}

export interface ClosureExample extends SourceExample<ClosureStep> {
  kind: ClosureKind;
}
```

```typescript
// data.ts
export const EXAMPLES: ClosureExample[] = [
  {
    id: "counter",
    title: "Counter Factory",
    description: "An inner function keeps a private count alive.",
    kind: "counter",
    codeLines: [
      { num: 1, text: "function makeCounter() {" },
      // ...
    ],
    steps: [
      {
        descriptionHtml: `Step 1 explanation with <code>inline code</code> and <span class="hl-stack">colored terms</span>.`,
        activeLine: 1,
        doneLines: [],
        consoleOutput: [],
        scope: [],
      },
      // ... one object per step
    ],
  },
];
```

```typescript
// index.tsx
"use client";

import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { ConsoleOutput } from "@/components/visualization-ui/ConsoleOutput";
import { ExamplePicker, KindBadge } from "@/components/visualization-ui/ExamplePicker";
import { SourceCodePanel } from "@/components/visualization-ui/SourceCodePanel";
import { SourceGrid, VisualizationSection, WaitingPlaceholder } from "@/components/visualization-ui/VisualizationLayout";
import { VisualizationToolbar } from "@/components/visualization-ui/VisualizationToolbar";
import { useExampleTopic } from "@/hooks/useExampleTopic";
import { useChangeFlash } from "@/hooks/useChangeFlash";
import { EXAMPLES } from "./data";
import { kindBadgeClass, kindLabel } from "./helpers";
import { ScopePanel } from "./components/ScopePanel";

export const Closures = () => {
  const { example, activeExampleId, handleExampleChange, playback, currentStep } =
    useExampleTopic(EXAMPLES);
  const { currentStepIndex } = playback;

  const flashes = useChangeFlash(
    {
      description: currentStep?.descriptionHtml,
      scope: currentStep?.scope,
      console: currentStep?.consoleOutput,
    },
    currentStepIndex,
  );

  return (
    <>
      <VisualizationToolbar
        playback={playback}
        totalSteps={example.steps.length}
        descriptionHtml={currentStep?.descriptionHtml}
        descriptionFlash={flashes.description}
        leading={
          <ExamplePicker
            examples={EXAMPLES}
            activeId={activeExampleId}
            onSelect={handleExampleChange}
            renderBadge={(ex) => (
              <KindBadge className={kindBadgeClass(ex.kind)}>{kindLabel(ex.kind)}</KindBadge>
            )}
          />
        }
      />

      <VisualizationSection>
        <SourceGrid>
          <SourceCodePanel
            lines={example.codeLines}
            activeLine={currentStep?.activeLine}
            doneLines={currentStep?.doneLines}
          />

          <div className="space-y-4">
            <NeonPanel
              title="Scope Chain"
              tone="cyan"
              bodyClassName="min-h-[10rem]"
              className={flashes.scope ? "viz-change-flash" : undefined}
            >
              {currentStep ? <ScopePanel entries={currentStep.scope} /> : <WaitingPlaceholder />}
            </NeonPanel>

            <div className={flashes.console ? "viz-change-flash rounded-3xl" : undefined}>
              <ConsoleOutput lines={currentStep?.consoleOutput ?? []} />
            </div>
          </div>
        </SourceGrid>
      </VisualizationSection>
    </>
  );
};
```

A topic with a single example skips the picker: call `useStepPlayback({ totalSteps: STEPS.length })` directly, omit `leading`, and set `toolbar: "simple"` in the registry. See `src/components/visualizations/closures/index.tsx`.

What the shared pieces do for you:

- `useExampleTopic` owns the active example, restarts playback when it changes, and returns the current step typed from your example's `steps`.
- `VisualizationToolbar` renders the transport controls (scrubber included) and the step description pill, and portals both above the card. `hideTransport`, `align`, and `descriptionOverride` cover the sandbox case.
- `SourceCodePanel` derives line classes once per step and never fades the active line.
- `WaitingPlaceholder` is the empty state for a panel before playback starts.

### Layout Pattern

Each visualization returns a **fragment** with two parts:

```
<>
  <VisualizationToolbar />   (portaled above the surface card)
    controls-row             (transport controls, optional picker/badges in `leading`)
    step-description-pill    (centered, rounded-full, max-w-4xl)

  <VisualizationSection>     (inside the surface card)
    <SourceGrid>             (source on the left, panels on the right at xl)
      <SourceCodePanel />
      topic-specific panels
      console-output
    </SourceGrid>
  </VisualizationSection>
</>
```

Row alignment is automatic: with `leading` the controls row is `justify-between`, without it the transport is centered. Pass `align="center"` to keep `leading` and the transport together (sandbox topics do this).

---

## Toolbar Portal Pattern

**Files:** `src/components/layout/ToolbarPortal.tsx`, `src/components/layout/VisualizationPageShell.tsx`, `src/components/visualization-ui/VisualizationToolbar.tsx`

The toolbar (transport controls + step description) is rendered _outside_ the surface card to maximize vertical space for visualization panels. This is achieved via a React context + portal pattern:

1. **`ToolbarProvider`** - wraps the shell and stores the mount node + toolbar readiness state in context.
2. **`ToolbarSlot`** - placed between header and card in the shell. Renders a skeleton (`simple` or `selector`, from `topic.toolbar`) until portaled content mounts.
3. **`ToolbarPortal`** - uses `createPortal` to render children into the `ToolbarSlot` from anywhere in the tree and toggles slot readiness.

`VisualizationToolbar` wraps all of this. Topics do not import `ToolbarPortal` directly.

---

## Step Data Modeling

Every visualization is driven by a hardcoded array of step objects. Each step represents the complete visual state at that point in the explanation.

### Design Principles

1. **Each step is a full snapshot.** The step object contains everything needed to render that moment: active line, done lines, queue contents, console output, description. No deltas.

2. **Description uses HTML strings.** Step descriptions support inline HTML for formatting: `<code>`, `<strong>`, and semantic highlight spans.

3. **Console output is cumulative.** Each step's `consoleOutput` array contains all output up to that point (not just the new line).

4. **Active lines must not be in `doneLines`.** When a line is re-executed (e.g., a callback line picked up by the event loop), remove it from `doneLines` for that step. The rendering uses `isDone && !isActive`, but clean data is still important for clarity and future-proofing.

5. **No emojis in descriptions or UI text.** Use `<strong>` for emphasis instead.

### Simple and Detailed text

`BaseStep` has an optional `simpleHtml`. When any step of an example sets it, the toolbar shows a Simple / Detailed toggle and readers who pick Simple see `simpleHtml` in the step pill instead of `descriptionHtml`. The choice is stored in the browser and follows the reader across topics.

Write `simpleHtml` for topics whose detailed text assumes background knowledge (the AI topics all have it). Rules for the simple version:

- Same step, same numbers, same code line. It is a plainer telling, not a different story.
- Short sentences, everyday words, one analogy at most. "Dial" for a weight, "question" for a query, "budget" for attention weights.
- No jargon without an explanation in the same sentence.
- `<code>` for literal values is fine; the highlight spans are optional.

Selector topics pass it through with `simpleHtml={currentStep?.simpleHtml}` and `hasSimpleText={hasSimpleText}` from `useExampleTopic`.

### Checking steps against code

`npm run audit:steps -- <topic-id>` loads the topic's data and reports, per example, any step whose `activeLine` is out of range or blank, any step whose active line is also in `doneLines`, and softer hints: active lines on a closing brace or comment, done lines that shrink (normal when a callback body re-runs), three steps in a row with no active line, and code lines that never light up. Errors fail CI; hints are for you to judge. Add `--strict` to also see identifiers named in `<code>` that live on a different line than the active one.

### Description HTML Highlight Classes

Use these inside `descriptionHtml` strings to colorize terms:

| Class       | Color  | Meaning                    |
| ----------- | ------ | -------------------------- |
| `.hl-stack` | amber  | Call stack references      |
| `.hl-api`   | cyan   | Web API references         |
| `.hl-task`  | green  | Task queue references      |
| `.hl-micro` | violet | Microtask queue references |
| `.hl-loop`  | pink   | Event loop references      |

Example:

```typescript
descriptionHtml: `<span class="hl-stack">Call Stack</span> receives <code>console.log('Start')</code>.`;
```

### Inline code in descriptions

Wrap code references in `<code>` tags. The `.viz-step-desc code` class in `globals.css` styles them with a subtle border and monospace font.

---

## UI Copy Constants

**File:** `src/lib/visualization/uiCopy.ts`

Centralized strings for consistent labeling:

```typescript
export const VISUALIZATION_PANEL_TITLES = {
  sourceCode: "Source Code",
  consoleOutput: "Console Output",
} as const;

export const VISUALIZATION_EMPTY_STATES = {
  consoleOutput: "No output yet.",
  stepDescription: "Press Play or Step to begin.",
} as const;
```

Always use these constants instead of hardcoding strings. Add new entries here when introducing shared labels.

---

## Checklist

When adding a new topic, verify every item:

### All Topics

- [ ] Topic registered in `src/lib/topics.ts` (including `docsUrl`; `toolbar: "simple"` if there is no example picker)
- [ ] Component registered in `VISUALIZATIONS` (`src/components/visualizations/registry.tsx`)
- [ ] Keywords added in `src/lib/metadata.ts` (`TOPIC_KEYWORDS`)
- [ ] Visualization folder created under `src/components/visualizations/<id>/`
- [ ] Component uses `"use client"` directive
- [ ] Component is exported as a named export (not default), in const arrow form
- [ ] Step type extends `BaseStep`; example type extends `SourceExample`
- [ ] Multi-example topics use `useExampleTopic(EXAMPLES)` and `ExamplePicker` (not a custom dropdown)
- [ ] Toolbar rendered with `VisualizationToolbar` (never hand-rolled)
- [ ] Main visualization in `VisualizationSection` + `SourceGrid`
- [ ] Source code displayed via `SourceCodePanel`
- [ ] Panel titles use `VISUALIZATION_PANEL_TITLES` constants (not hardcoded strings)
- [ ] Panels wrapped in `NeonPanel` with appropriate tones; empty state via `WaitingPlaceholder`
- [ ] Step descriptions use HTML with semantic highlight classes
- [ ] Active lines removed from `doneLines` when re-executed by callbacks/event loop
- [ ] `useChangeFlash` hook called with channels for each panel
- [ ] `descriptionFlash={flashes.description}` passed to `VisualizationToolbar`
- [ ] `viz-change-flash` applied to NeonPanels via `className` (no flash-based `key` props)
- [ ] Child items use data fingerprints in keys (not step index) for selective `viz-slide-in` re-triggers
- [ ] If related topics exist, `TopicLink` shown conditionally on last step of relevant example
- [ ] No emojis in step descriptions or UI text
- [ ] No em dashes or AI-sounding language in user-facing content
- [ ] `npm run audit:steps -- <topic-id>` reports no errors and the hints make sense
- [ ] `npm run verify` passes (lint, typecheck, format, step audit, build)
- [ ] Visual check on desktop and mobile
- [ ] All transport controls work: play, pause, step forward, step back, reset, speed change

### JS Topics (additional)

- [ ] Console output rendered via `ConsoleOutput`

### React Topics (additional)

See [react-topic-authoring.md](react-topic-authoring.md) for the full React checklist.
