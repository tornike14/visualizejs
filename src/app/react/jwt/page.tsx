import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const jwtTopic = getTopicOrThrow("jwt");

const JwtVisualization = dynamic(
  () => import("@/components/visualizations/JWT").then((module) => module.JWT),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(jwtTopic);

export default function JwtPage() {
  return (
    <VisualizationPageShell topic={jwtTopic}>
      <ErrorBoundary>
        <JwtVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
