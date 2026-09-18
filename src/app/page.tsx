import type { Metadata } from "next";
import { HomeLandingPage } from "@/components/layout/HomeLandingPage";

export const metadata: Metadata = {
  title: "JavaScript, React, Backend, and AI Visualizer",
  description:
    "Free visualizer for JavaScript, React, Vue, Svelte, Angular, backend systems, and AI models. Step through the event loop, closures, reconciliation, HTTP requests, attention, and more with interactive animations.",
  keywords: [
    "javascript visualizer",
    "js visualizer",
    "javascript visualization",
    "visualize javascript",
    "react visualizer",
    "javascript code visualizer",
    "javascript execution visualizer",
    "learn javascript visually",
    "javascript interview preparation",
    "backend visualizer",
    "how llms work visualized",
    "vue svelte angular reactivity",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomeLandingPage />;
}
