import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("jwt-authentication");

const JwtAuthenticationVisualization = dynamic(
  () =>
    import("@/components/visualizations/jwt-authentication").then(
      (module) => module.JwtAuthentication,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function JwtAuthenticationPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <JwtAuthenticationVisualization />
    </VisualizationPageShell>
  );
}
