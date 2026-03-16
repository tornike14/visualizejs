---
description: Create a theory page for an existing visualization topic that does not have one yet, including content file, registry entry, and metadata description.
---

# Create Theory Page

Create theory content for an existing topic. Theory pages provide conceptual explanations, step-by-step breakdowns, common mistakes, and interview questions.

## When to Use

When the user asks to add a theory page, theory content, or educational content for a topic.

## Workflow

1. **Identify the topic.** Ask the user or infer from context. Verify the topic exists in `src/lib/topics.ts`.

2. **Check if theory already exists.** Look in `src/content/theory/index.ts` for an existing entry. If it exists, offer to update instead.

3. **Read the reference implementation** at `src/content/theory/react/reconciliation.ts` for tone, depth, and structure.

4. **Read the full field-by-field guidance** in `docs/theory-authoring.md`.

5. **Determine category** from the topic's `category` field in `src/lib/topics.ts`.

6. **Create the content file** at `src/content/theory/<category>/<id>.ts`. Export as `<topicCamelCase>Theory`.

   Fill all fields per `docs/theory-authoring.md`:
   - `summary`: 1-2 sentences, clear, jargon-free
   - `whatItIs`: 3+ paragraphs with progressive depth
   - `howItWorks`: 3+ ordered steps, each starting with "Step N:"
   - `commonMistakes`: 2-4 entries with short titles and actionable fixes
   - `interviewQuestions`: 3+ Q&A pairs, optional code examples
   - `relatedTopicIds`: 3-5 valid topic IDs from `src/lib/topics.ts` (NEVER empty)

7. **Register** in `src/content/theory/index.ts`. Import and add to `THEORY_CONTENT_BY_TOPIC_ID`.

8. **Add theory description** in `src/lib/metadata.ts` under `TOPIC_THEORY_DESCRIPTIONS`. Write a 1-2 sentence SEO description.

9. **Verify:** Run `npm run build`. Fix any errors.

## Key Files

- `src/lib/topics.ts` -- verify topic exists
- `src/content/theory/<category>/<id>.ts` -- content file (new)
- `src/content/theory/index.ts` -- registry
- `src/content/theory/types.ts` -- TopicTheoryContent interface
- `src/lib/metadata.ts` -- TOPIC_THEORY_DESCRIPTIONS
- `src/content/theory/react/reconciliation.ts` -- reference implementation

## Documentation

- `docs/theory-authoring.md` -- full guide with field-by-field guidance, tone rules, and checklist

## Content Tone Rules

- No em dashes. Use periods, commas, or restructure sentences.
- No AI-sounding language ("it's important to note", "let's explore").
- No emojis.
- Direct, technical prose. Explain clearly without being verbose.
