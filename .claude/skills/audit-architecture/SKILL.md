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
Search for `export function` declarations in `src/components/visualizations/` that should be `const`-form arrow functions. Note: the existing codebase uses `export function` for main visualization components, so only flag new patterns that deviate from the established convention.

### 7. Panel Title Constants
Search visualization files for hardcoded strings `"Source Code"` or `"Console Output"` that should use `VISUALIZATION_PANEL_TITLES` from `uiCopy.ts`. Flag violations.

### 8. ExampleSelector Registration
For topics using `ExampleSelector`, verify their ID appears in `SELECTOR_TOOLBAR_TOPIC_IDS` in `VisualizationPageShell.tsx`. Cross-reference by searching for `ExampleSelector` imports in visualization files.

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
