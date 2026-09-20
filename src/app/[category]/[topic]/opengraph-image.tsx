import { CATEGORIES } from "@/lib/categories";
import { SOCIAL_IMAGE_ALT } from "@/lib/constants";
import { getTopicDescription } from "@/lib/metadata";
import { renderSocialImage, SOCIAL_IMAGE_SIZE } from "@/lib/socialImage";
import { getTopicById, topics } from "@/lib/topics";

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return topics.map((topic) => ({ category: topic.category, topic: topic.id }));
}

export default async function TopicImage({
  params,
}: {
  params: Promise<{ category: string; topic: string }>;
}) {
  const { topic: topicId } = await params;
  const topic = getTopicById(topicId) ?? topics[0];
  const category = CATEGORIES[topic.category];

  return renderSocialImage({
    kicker: `${category.label} · ${topic.difficulty}`,
    title: topic.title,
    subtitle: getTopicDescription(topic),
    accentRgb: category.hero.accent,
  });
}
