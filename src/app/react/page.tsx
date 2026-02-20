import type { Metadata } from "next";
import { ReactComingSoonHero } from "@/components/layout/ReactComingSoonHero";

export const metadata: Metadata = {
  title: "React Concepts Coming Soon",
  description:
    "React visualizations are being redesigned and will be available soon.",
  keywords: ["react concepts", "react fundamentals", "react visualizations"],
  alternates: {
    canonical: "/react",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function ReactIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-10 pt-3 lg:px-10 lg:py-10">
      <ReactComingSoonHero />
    </div>
  );
}
