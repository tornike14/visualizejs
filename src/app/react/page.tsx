import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "React Concepts Coming Soon",
  description:
    "React visualizations are being redesigned and will be available soon.",
  keywords: ["react concepts", "react fundamentals", "react visualizations"],
  alternates: {
    canonical: "/react",
  },
};

export default function ReactIndexPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-10 pt-3 lg:px-10 lg:py-10">
      <section className="app-surface rounded-3xl px-8 py-14 text-center lg:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-200/80">
          React Track
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-100 lg:text-5xl">
          Coming Soon
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[color:var(--app-text-secondary)] lg:text-base">
          We are redesigning the React section for a better learning experience.
          Virtual DOM and JWT visualizations are temporarily removed and will
          return with a cleaner interactive format.
        </p>
      </section>
    </div>
  );
}
