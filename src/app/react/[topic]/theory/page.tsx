import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TheoryArticle } from "@/components/theory/TheoryArticle";
import {
  getRelatedTopicsFromTheory,
  getTheoryContent,
  getTheoryTopicsByCategory,
} from "@/content/theory";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { createTopicTheoryMetadata, getTopicKeywords } from "@/lib/metadata";
import { getTopicById } from "@/lib/topics";

interface TopicTheoryPageProps {
  params: Promise<{ topic: string }>;
}

async function resolveTopicTheory(paramsPromise: TopicTheoryPageProps["params"]) {
  const { topic: topicId } = await paramsPromise;
  const topic = getTopicById(topicId);
  const theory = getTheoryContent(topicId);

  if (!topic || topic.category !== "react" || !theory) {
    return null;
  }

  return { topic, theory };
}

export function generateStaticParams() {
  return getTheoryTopicsByCategory("react").map((topic) => ({
    topic: topic.id,
  }));
}

export async function generateMetadata({
  params,
}: TopicTheoryPageProps): Promise<Metadata> {
  const data = await resolveTopicTheory(params);
  if (!data) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return createTopicTheoryMetadata(data.topic);
}

export default async function TopicTheoryPage({ params }: TopicTheoryPageProps) {
  const data = await resolveTopicTheory(params);
  if (!data) {
    notFound();
  }

  const { topic, theory } = data;
  const canonicalUrl = `${SITE_URL}${topic.route}/theory`;
  const relatedTopics = getRelatedTopicsFromTheory(topic.id);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${topic.title} Theory Guide`,
    description: theory.summary,
    url: canonicalUrl,
    inLanguage: "en-US",
    keywords: getTopicKeywords(topic).join(", "),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: canonicalUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "React Concepts",
        item: `${SITE_URL}/react`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.title,
        item: `${SITE_URL}${topic.route}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${topic.title} Theory`,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: theory.interviewQuestions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <TheoryArticle topic={topic} content={theory} relatedTopics={relatedTopics} />
    </>
  );
}
