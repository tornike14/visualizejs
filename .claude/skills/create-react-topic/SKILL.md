---
description: Create a new React visualization topic with folder-based structure, ComponentTreeDiagram, theory content, and all required wiring.
---

# Create React Topic

Scaffold a new React visualization topic end-to-end. React topics always use folder-based structure and typically include ComponentTreeDiagram for tree diffing visualizations.

## When to Use

When the user asks to create, add, or build a new React topic or visualization.

## Workflow

1. **Gather inputs** from the user:
   - Topic ID (kebab-case, e.g., `use-effect-lifecycle`)
   - Title (display name, e.g., "useEffect Lifecycle")
   - Difficulty (`beginner`, `intermediate`, or `advanced`)
   - `docsUrl` (react.dev reference URL)
   - Description (1-2 sentences for SEO and landing page cards)
   - Kind variants (e.g., `"mount" | "update" | "unmount"`)

2. **Read the reference implementation** at `src/components/visualizations/reconciliation/` -- read all files (`types.ts`, `helpers.ts`, `data.ts`, `index.tsx`, `components/DiffPanel.tsx`) to understand the exact pattern.

3. **Register the topic** in `src/lib/topics.ts` with `category: "react"`. The route is derived; do not add one. Once registered, `npm run typecheck` reports every registry that still lacks an entry.

4. **Add SEO keywords** in `src/lib/metadata.ts` under `TOPIC_KEYWORDS`.

5. **Register the component** in `VISUALIZATIONS` in `src/components/visualizations/registry.tsx` (one `dynamic()` entry keyed by topic id). Routing is generated from the registry.

6. **Scaffold the folder structure:**

   ```
   src/components/visualizations/<topic-id>/
     types.ts       # Step, Example, Kind types
     helpers.ts     # kindBadgeClass, kindLabel using shared factories
     data.ts        # EXAMPLES array with step data
     index.tsx      # useExampleTopic + VisualizationToolbar + ExamplePicker + ComponentTreeDiagram
     components/    # Sub-components as needed
   ```

   - Read `docs/react-topic-authoring.md` for React-specific patterns
   - Read `docs/component-reference.md` for ComponentTreeDiagram API

7. **Set `toolbar: "simple"`** in the topic entry only if the topic has no example picker (React topics normally do, so skip this).

8. **Create theory content** at `src/content/theory/react/<id>.ts`. Read `docs/theory-authoring.md` for requirements.

9. **Register theory** in `src/content/theory/index.ts`.

10. **Add theory description** in `src/lib/metadata.ts` under `TOPIC_THEORY_DESCRIPTIONS`.

11. **Verify:** Run `npm run audit:steps -- <id>` and fix anything it flags, then `npm run verify`.

## Key Files

- `src/lib/topics.ts` -- topic registry
- `src/lib/metadata.ts` -- keywords and theory descriptions
- `src/components/visualizations/registry.tsx` -- component registry
- `src/components/visualizations/<topic-id>/` -- visualization folder (new)
- `src/content/theory/react/<id>.ts` -- theory content (new)
- `src/content/theory/index.ts` -- theory registry
- `src/components/visualizations/reconciliation/` -- reference implementation

## Documentation

- `docs/react-topic-authoring.md` -- React topic extensions and checklist
- `docs/topic-authoring.md` -- base topic workflow
- `docs/component-reference.md` -- ComponentTreeDiagram, hooks, design system
- `docs/theory-authoring.md` -- theory content requirements

## NeonPanel Tone Conventions

| Panel          | Tone     |
| -------------- | -------- |
| Source Code    | `amber`  |
| Previous Tree  | `cyan`   |
| New Tree       | `green`  |
| DOM Operations | `violet` |

## Non-Negotiable Rules

- Always use folder-based structure for React topics
- Use `ComponentTreeDiagram` for tree visualizations (auto-scales, no horizontal scroll)
- No em dashes or AI-sounding language in content
- No emojis in step descriptions or UI text
- Use `useExampleTopic` + `VisualizationToolbar` + `ExamplePicker`; never hand-roll the toolbar or step pill
- Theory `relatedTopicIds` must have 3-5 valid IDs (never empty)
