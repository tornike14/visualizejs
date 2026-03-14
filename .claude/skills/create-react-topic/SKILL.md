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

3. **Register the topic** in `src/lib/topics.ts` with `category: "react"` and `route: "/react/<id>"`.

4. **Add SEO keywords** in `src/lib/metadata.ts` under `TOPIC_KEYWORDS`.

5. **Create the route page** at `src/app/react/<id>/page.tsx`. Follow the pattern from `src/app/react/reconciliation/page.tsx`.

6. **Scaffold the folder structure:**
   ```
   src/components/visualizations/<topic-id>/
     types.ts       # Step, Example, Kind types
     helpers.ts     # kindBadgeClass, kindLabel using shared factories
     data.ts        # EXAMPLES array with step data
     index.tsx      # Main component with ExampleSelector + ComponentTreeDiagram
     components/    # Sub-components as needed
   ```
   - Read `docs/react-topic-authoring.md` for React-specific patterns
   - Read `docs/component-reference.md` for ComponentTreeDiagram API

7. **Add to SELECTOR_TOOLBAR_TOPIC_IDS** in `src/components/layout/VisualizationPageShell.tsx`.

8. **Create theory content** at `src/content/theory/react/<id>.ts`. Read `docs/theory-authoring.md` for requirements.

9. **Register theory** in `src/content/theory/index.ts`.

10. **Add theory description** in `src/lib/metadata.ts` under `TOPIC_THEORY_DESCRIPTIONS`.

11. **Verify:** Run `npm run build`. Fix any errors.

## Key Files

- `src/lib/topics.ts` -- topic registry
- `src/lib/metadata.ts` -- keywords and theory descriptions
- `src/app/react/<id>/page.tsx` -- route page (new)
- `src/components/visualizations/<topic-id>/` -- visualization folder (new)
- `src/content/theory/react/<id>.ts` -- theory content (new)
- `src/content/theory/index.ts` -- theory registry
- `src/components/layout/VisualizationPageShell.tsx` -- SELECTOR_TOOLBAR_TOPIC_IDS
- `src/components/visualizations/reconciliation/` -- reference implementation

## Documentation

- `docs/react-topic-authoring.md` -- React topic extensions and checklist
- `docs/topic-authoring.md` -- base topic workflow
- `docs/component-reference.md` -- ComponentTreeDiagram, hooks, design system
- `docs/theory-authoring.md` -- theory content requirements

## NeonPanel Tone Conventions

| Panel          | Tone     |
|----------------|----------|
| Source Code    | `amber`  |
| Previous Tree  | `cyan`   |
| New Tree       | `green`  |
| DOM Operations | `violet` |

## Non-Negotiable Rules

- Always use folder-based structure for React topics
- Use `ComponentTreeDiagram` for tree visualizations (auto-scales, no horizontal scroll)
- No em dashes or AI-sounding language in content
- No emojis in step descriptions or UI text
- Use `handleExampleChange` callback wrapper
- Theory `relatedTopicIds` must have 3-5 valid IDs (never empty)
