import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("rate-limiting");

const RateLimitingVisualization = dynamic(
  () =>
    import("@/components/visualizations/rate-limiting").then(
      (module) => module.RateLimiting,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function RateLimitingPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <RateLimitingVisualization />
    </VisualizationPageShell>
  );
}
