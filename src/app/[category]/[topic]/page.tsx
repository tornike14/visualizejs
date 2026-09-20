import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { TopicVisualization } from "@/components/visualizations/registry";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicById, isTopicId, topics } from "@/lib/topics";
import type { Topic } from "@/types";

interface TopicPageProps {
  params: Promise<{ category: string; topic: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return topics.map((topic) => ({ category: topic.category, topic: topic.id }));
}

/** The topic for this URL, or a 404 when the id or category does not match. */
const resolveTopic = async (
  params: TopicPageProps["params"],
): Promise<Topic> => {
  const { category, topic: topicId } = await params;
  const topic = getTopicById(topicId);
  if (!topic || topic.category !== category) notFound();
  return topic;
};

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  return createTopicMetadata(await resolveTopic(params));
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = await resolveTopic(params);
  if (!isTopicId(topic.id)) notFound();

  return (
    <VisualizationPageShell topic={topic}>
      <TopicVisualization topicId={topic.id} />
    </VisualizationPageShell>
  );
}
