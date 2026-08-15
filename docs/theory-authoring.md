# Theory Authoring Guide

How to add theory content for visualization topics. Theory sections render on the topic page beneath the visualization, and provide in-depth conceptual explanations, step-by-step breakdowns, common mistakes, and interview questions for each topic.

---

## Folder Structure

- Content model types: `src/content/theory/types.ts`
- Content registry: `src/content/theory/index.ts`
- Topic content files:
  - `src/content/theory/javascript/<topic-id>.ts`
  - `src/content/theory/react/<topic-id>.ts`
- Shared theory renderer: `src/components/theory/TopicTheorySections.tsx`
- Rendered by `src/components/layout/VisualizationPageShell.tsx`, which pulls
  content from the registry and places it below the visualization. There is no
  separate theory route.

---

## Naming Convention

File name must match topic id exactly:
- JS example: topic id `promises` -> `src/content/theory/javascript/promises.ts`
- React example: topic id `reconciliation` -> `src/content/theory/react/reconciliation.ts`

---

## Add a New Theory Page

1. Create topic content file under `src/content/theory/<category>/`.
2. Export a `TopicTheoryContent` object (named `<topicCamelCase>Theory`).
3. Import and register in `THEORY_CONTENT_BY_TOPIC_ID` in `src/content/theory/index.ts`.
4. Add a theory description in `TOPIC_THEORY_DESCRIPTIONS` in `src/lib/metadata.ts`.
5. Run `npm run lint` and `npm run build`.

After registration:
- The theory sections render on `/<category>/<topic-id>`, below the visualization.
- The topic page header shows the `Theory` button, which scrolls to those sections.
- No sitemap change is needed, since the content shares the topic's URL.

---

## TopicTheoryContent Interface

Defined in `src/content/theory/types.ts`:

```typescript
export interface TopicTheoryContent {
  summary: string;
  whatItIs: string[];
  howItWorks: string[];
  commonMistakes: TheoryMistake[];
  interviewQuestions: TheoryInterviewQuestion[];
  relatedTopicIds: string[];
}

export interface TheoryMistake {
  title: string;
  explanation: string;
  fix: string;
}

export interface TheoryInterviewQuestion {
  question: string;
  answer: string;
  codeExample?: TheoryCodeExample;
}

export interface TheoryCodeExample {
  code: string;
  language?: string;
}
```

---

## Field-by-Field Guidance

### `summary`

One or two sentences. Explains what the concept is and why it matters. No jargon without context. This appears as the lead paragraph on the theory page.

Example: "Reconciliation is the algorithm React uses to diff two virtual DOM trees and determine the minimal set of DOM operations needed to update the UI after a state change."

### `whatItIs`

Array of 3+ paragraphs (strings). Progressively deeper explanation of the concept. Start accessible and build toward technical detail. This is not a reproduction of MDN or React docs. Focus on the "why" and mental model, not exhaustive API coverage.

Guidelines:
- First paragraph: accessible explanation anyone can understand
- Second paragraph: key technical insight or mechanism
- Third paragraph: how it connects to the runtime or broader system
- Keep each paragraph to 2-3 sentences

### `howItWorks`

Array of ordered steps (strings). Each step starts with "Step N:" prefix. Describes the runtime or engine behavior in sequence. Focus on what happens internally, not how to use the API.

Guidelines:
- 3-6 steps
- Each step is 1-2 sentences
- Steps should follow a logical execution order

### `commonMistakes`

Array of `TheoryMistake` objects. Each has `title`, `explanation`, and `fix`.

Guidelines:
- 2-4 mistakes per topic
- `title`: short label (3-8 words)
- `explanation`: why this mistake happens (1-2 sentences)
- `fix`: actionable advice to avoid or correct it (1-2 sentences)

### `interviewQuestions`

Array of `TheoryInterviewQuestion` objects. At least 3 Q&A pairs.

Guidelines:
- Questions should cover different difficulty levels
- Answers should be concise but complete (2-4 sentences)
- Optional `codeExample` with `code` string and `language` field (defaults to `"javascript"`)
- Code examples should be short (5-15 lines) and directly illustrate the answer

### `relatedTopicIds`

Array of 3-5 topic IDs from `src/lib/topics.ts`. **Never leave this empty.** Cross-category links are allowed (e.g., a React topic can link to JS topics).

Guidelines:
- Choose topics that share conceptual overlap
- Prefer topics that help build understanding (prerequisites or next steps)
- Verify each ID exists in `src/lib/topics.ts`

---

## Content Tone

- No em dashes. Use periods, commas, or restructure sentences.
- No AI-sounding language ("it's important to note that", "it's worth mentioning", "let's explore").
- No emojis.
- Write in direct, technical prose. Explain clearly without being verbose.
- Use "you" sparingly. Prefer describing what the engine/runtime does.

---

## Reference Implementation

The **Reconciliation** theory file (`src/content/theory/react/reconciliation.ts`) is the reference implementation. Study it for tone, depth, and structure when writing new theory content.

---

## Quality Checklist

- [ ] Export name follows pattern: `<topicCamelCase>Theory`
- [ ] `summary` is 1-2 sentences, clear and jargon-free
- [ ] `whatItIs` has 3+ paragraphs with progressive depth
- [ ] `howItWorks` has 3+ ordered steps, each starting with "Step N:"
- [ ] `commonMistakes` has 2-4 entries with short titles and actionable fixes
- [ ] `interviewQuestions` has 3+ Q&A pairs
- [ ] `relatedTopicIds` has 3-5 valid topic IDs (not empty)
- [ ] All related topic IDs exist in `src/lib/topics.ts`
- [ ] Content registered in `src/content/theory/index.ts`
- [ ] Theory description added in `TOPIC_THEORY_DESCRIPTIONS` in `src/lib/metadata.ts`
- [ ] No em dashes or AI-sounding language
- [ ] No emojis
- [ ] `npm run build` passes
