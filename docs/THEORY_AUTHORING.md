# Theory Authoring Guide

This guide describes how to add theory pages for additional topics.

## Folder structure

- Content model types:
  - `src/content/theory/types.ts`
- Content registry:
  - `src/content/theory/index.ts`
- Topic content files:
  - `src/content/theory/javascript/<topic-id>.ts`
  - `src/content/theory/react/<topic-id>.ts`
- Shared theory page renderer:
  - `src/components/theory/TheoryArticle.tsx`
- Generic routes:
  - `src/app/javascript/[topic]/theory/page.tsx`
  - `src/app/react/[topic]/theory/page.tsx`

## Naming convention

- File name must match topic id exactly.
  - JS example: topic id `promises` -> `src/content/theory/javascript/promises.ts`
  - React example: topic id `reconciliation` -> `src/content/theory/react/reconciliation.ts`

## Add a new theory page

1. Create topic content file under `src/content/theory/<category>/`.
2. Export a `TopicTheoryContent` object.
3. Register the content in `THEORY_CONTENT_BY_TOPIC_ID` in `src/content/theory/index.ts`.
4. Add a theory description in `TOPIC_THEORY_DESCRIPTIONS` in `src/lib/metadata.ts`.
5. Run lint/build.

After registration:
- `/<category>/<topic-id>/theory` is statically generated.
- The topic visualization header shows the `Theory` button.
- The sitemap includes the new theory URL automatically.

## Content requirements

Every topic should include:

- `summary`
- `whatItIs` (3+ concise paragraphs, not full docs)
- `howItWorks` (ordered steps)
- `commonMistakes` (title + explanation + fix)
- `interviewQuestions` (at least 3 Q&A pairs, optionally with `codeExample`)
- `relatedTopicIds` (3 to 5 links, never leave empty). Use topic IDs from `src/lib/topics.ts`. Cross-category links are allowed (e.g., a React topic can link to JS topics).
