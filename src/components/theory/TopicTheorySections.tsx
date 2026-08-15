import { ExternalLink } from "lucide-react";
import type { TopicTheoryContent } from "@/content/theory/types";
import { TopicLink } from "@/components/visualization-ui/TopicLink";
import type { Topic } from "@/types";

interface TopicTheorySectionsProps {
  topic: Topic;
  content: TopicTheoryContent;
  relatedTopics: Topic[];
}

export const TopicTheorySections = ({
  topic,
  content,
  relatedTopics,
}: TopicTheorySectionsProps) => {
  const categoryLabel = topic.category === "javascript" ? "JavaScript" : "React";

  return (
    <div id="theory" className="flex scroll-mt-20 flex-col gap-5">
      <section className="app-surface rounded-2xl p-4 lg:p-5">
        <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">
          What is {topic.title} in {categoryLabel}?
        </h2>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-[color:var(--app-text-secondary)] lg:text-base">
          {content.summary}
        </p>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[color:var(--app-text-secondary)] lg:text-base">
          {content.whatItIs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="rounded-xl border border-cyan-300/20 bg-cyan-400/8 px-3 py-2 text-cyan-100/95">
            Interview framing: define {topic.title} in one sentence, then explain
            one concrete runtime behavior and one common pitfall with a short code
            example.
          </p>
        </div>
        <a
          href={topic.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-400/8 px-3 py-1.5 text-xs font-medium text-cyan-200 transition-colors hover:border-cyan-300/55 hover:bg-cyan-300/12"
        >
          {topic.title} on MDN
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </section>

      <section className="app-surface rounded-2xl p-4 lg:p-5">
        <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">
          How {topic.title} works
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[color:var(--app-text-secondary)] lg:text-base">
          {content.howItWorks.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="app-surface rounded-2xl p-4 lg:p-5">
        <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">
          Common {topic.title} mistakes
        </h2>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {content.commonMistakes.map((mistake) => (
            <article
              key={mistake.title}
              className="rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] p-3"
            >
              <h3 className="text-sm font-semibold text-[color:var(--app-text-primary)] lg:text-base">
                {mistake.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--app-text-secondary)]">
                {mistake.explanation}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-cyan-200">
                Fix: {mistake.fix}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-surface rounded-2xl p-4 lg:p-5">
        <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">
          {topic.title} interview questions
        </h2>
        <p className="mt-2 text-sm text-[color:var(--app-text-secondary)]">
          Common interview prompts with concise model answers.
        </p>
        <div className="mt-3 space-y-3">
          {content.interviewQuestions.map((entry) => (
            <article
              key={entry.question}
              className="rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] p-3"
            >
              <h3 className="text-sm font-semibold text-[color:var(--app-text-primary)] lg:text-base">
                {entry.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--app-text-secondary)]">
                {entry.answer}
              </p>
              {entry.codeExample && (
                <pre className="mt-3 overflow-x-auto rounded-lg border border-slate-700/60 bg-slate-950/80 p-3 text-xs leading-relaxed text-cyan-100">
                  <code>{entry.codeExample.code}</code>
                </pre>
              )}
            </article>
          ))}
        </div>
      </section>

      {relatedTopics.length > 0 && (
        <section className="app-surface rounded-2xl p-4 lg:p-5">
          <h2 className="text-xl font-semibold tracking-tight lg:text-2xl">
            Related {categoryLabel} concepts
          </h2>
          <p className="mt-2 text-sm text-[color:var(--app-text-secondary)]">
            Continue with these concepts to strengthen your mental model.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {relatedTopics.map((relatedTopic) => (
              <TopicLink
                key={relatedTopic.id}
                href={relatedTopic.route}
                label={relatedTopic.title}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
