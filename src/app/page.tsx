import type { Metadata } from "next";
import { HomeLandingPage } from "@/components/layout/HomeLandingPage";

export const metadata: Metadata = {
  title: "JavaScript and React Visualizer",
  description:
    "Free JavaScript and React visualizer. Step through the event loop, closures, hoisting, promises, the virtual DOM, and hooks with interactive animations.",
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
  ],
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomeLandingPage />;
}
