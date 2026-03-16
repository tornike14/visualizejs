---
description: Run pre-release verification including lint, build, route completeness, and registry cross-checks to confirm the project is ready to ship.
---

# Release Check

Pre-release verification that runs lint, build, and cross-checks all registries for completeness.

## When to Use

When the user asks to verify, check, or validate before release, deploy, or merge. Also useful before creating a PR.

## Checks

### 1. Lint
Run `npm run lint`. Report any errors or warnings.

### 2. Build
Run `npm run build`. Report any build failures. Capture and display the generated routes list from build output.

### 3. Route Page Coverage
For every topic in `src/lib/topics.ts`, verify a route page file exists at `src/app/<category>/<id>/page.tsx`. Flag missing route pages.

### 4. ExampleSelector Registration
Search visualization files for `ExampleSelector` imports. For each topic using it, verify the topic ID is in `SELECTOR_TOOLBAR_TOPIC_IDS` in `src/components/layout/VisualizationPageShell.tsx`. Flag missing registrations.

### 5. Theory Registration
For every theory content file in `src/content/theory/javascript/` and `src/content/theory/react/`, verify it is imported and registered in `src/content/theory/index.ts`. Flag unregistered files.

### 6. Console.log Audit
Search for `console.log` statements in `src/` (excluding `src/content/` and `ConsoleOutput` rendering). Flag any found in production code.

### 7. Topic-Keyword Cross-Check
Verify every topic in `src/lib/topics.ts` has a `TOPIC_KEYWORDS` entry in `src/lib/metadata.ts`.

## Output Format

Report as a numbered pass/fail list with actionable items:
```
1. PASS: Lint (0 errors, 0 warnings)
2. PASS: Build (17 routes generated)
3. FAIL: Missing route page for topic "async-generators"
...
```

## Documentation

- `docs/architecture.md` -- PR checklist
- `docs/topic-authoring.md` -- topic checklist
