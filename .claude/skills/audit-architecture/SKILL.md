---
description: Audit the codebase for architecture violations, oversized components, incorrect patterns, missing conventions, and structural issues.
---

# Architecture Audit

Read-only audit of the codebase against architecture guidelines. Reports violations with file paths and suggested fixes.

## When to Use

When the user asks to audit, review, or check architecture compliance, code structure, or conventions.

## Checks

Run each check and report findings:

### 1. Component Size Limits

Search `src/components/` for `.tsx` files over 300 lines. Flag each with line count and suggestion to extract sub-components or data files.

### 2. Folder-Based Topic Structure

For each folder in `src/components/visualizations/*/`, verify these files exist:

- `index.tsx`
- `types.ts`
- `helpers.ts`
- `data.ts`

Report any missing files.

### 3. `"use client"` Directive

Check all visualization components in `src/components/visualizations/` for the `"use client"` directive on line 1. Flag any missing.

### 4. Named Exports

Check visualization components use named exports (not `export default`). Search for `export default` in visualization files and flag.

### 5. Import Alias Usage

Search for deep relative imports (e.g., `../../../`) in `src/components/`. These should use the `@/` alias. Flag violations.

### 6. Const-Form Components

Search for `export function` or `function X(` component declarations in `src/components/` and `src/hooks/`. Every component and hook uses const arrow form; only Next.js `page.tsx` and `layout.tsx` under `src/app/` use `export default function`.

### 7. Panel Title Constants

Search visualization files for hardcoded strings `"Source Code"` or `"Console Output"` that should use `VISUALIZATION_PANEL_TITLES` from `uiCopy.ts`. Flag violations.

### 8. ExampleSelector Registration

For topics with no example picker (`useStepPlayback` called directly, no `ExamplePicker`), verify the registry entry sets `toolbar: "simple"`. For topics that hand-roll a toolbar (`ToolbarPortal`, `TransportControls`, or `VISUALIZATION_EMPTY_STATES.stepDescription` imported in a topic `index.tsx`), flag them: topics must use `VisualizationToolbar`, `SourceCodePanel`, and `useExampleTopic`.

### 9. Category Branching

Search `src/components/` and `src/lib/` for `=== "javascript"` or `=== "react"`. Components must read `CATEGORIES[topic.category]` from `src/lib/categories.ts` instead. Flag violations.

## Output Format

Report as a numbered list:

```
1. PASS: Component size limits (all under 300 lines)
2. FAIL: Missing types.ts in src/components/visualizations/closures/
3. PASS: All visualization components have "use client"
...
```

## Documentation

- `docs/architecture.md` -- frontend architecture rules
- `docs/topic-authoring.md` -- file structure expectations and checklist
