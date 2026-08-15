import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("use-effect-lifecycle");

const UseEffectLifecycleVisualization = dynamic(
  () =>
    import("@/components/visualizations/use-effect-lifecycle").then(
      (module) => module.UseEffectLifecycle,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function UseEffectLifecyclePage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ErrorBoundary>
        <UseEffectLifecycleVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
