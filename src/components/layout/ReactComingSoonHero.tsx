"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useRef } from "react";
import { Blocks, Orbit, Sparkles } from "lucide-react";

const PREVIEW_ITEMS = [
  {
    title: "Rendering Pipeline",
    description: "From state update to commit phase with visual timing layers.",
    icon: Orbit,
  },
  {
    title: "State and Effects",
    description: "Track how hooks schedule updates and sync with the UI lifecycle.",
    icon: Sparkles,
  },
  {
    title: "Component Graph",
    description: "Follow parent-child propagation and re-render boundaries.",
    icon: Blocks,
  },
];

export function ReactComingSoonHero() {
  const shellRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const rect = shell.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * 9;
    const tiltY = (x - 0.5) * 10;

    shell.style.setProperty("--react-coming-tilt-x", `${tiltX.toFixed(2)}deg`);
    shell.style.setProperty("--react-coming-tilt-y", `${tiltY.toFixed(2)}deg`);
    shell.style.setProperty("--react-coming-glow-x", `${(x * 100).toFixed(2)}%`);
    shell.style.setProperty("--react-coming-glow-y", `${(y * 100).toFixed(2)}%`);
  };

  const handleMouseLeave = () => {
    const shell = shellRef.current;
    if (!shell) {
      return;
    }
    shell.style.setProperty("--react-coming-tilt-x", "0deg");
    shell.style.setProperty("--react-coming-tilt-y", "0deg");
    shell.style.setProperty("--react-coming-glow-x", "50%");
    shell.style.setProperty("--react-coming-glow-y", "40%");
  };

  return (
    <section className="react-coming-wrap">
      <div
        ref={shellRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="react-coming-shell flex min-h-[30rem] items-center rounded-3xl p-6 sm:min-h-[32rem] sm:p-8 lg:min-h-[34rem] lg:p-10"
      >
        <div aria-hidden className="react-coming-grid-overlay" />
        <div aria-hidden className="react-coming-pointer-glow" />
        <div aria-hidden className="react-coming-orbit react-coming-orbit-one" />
        <div aria-hidden className="react-coming-orbit react-coming-orbit-two" />
        <div aria-hidden className="react-coming-blob react-coming-blob-cyan" />
        <div aria-hidden className="react-coming-blob react-coming-blob-violet" />
        <div aria-hidden className="react-coming-scan" />

        <div className="relative z-[2] mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <p className="react-coming-pill rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
            React Track Rebuild
          </p>

          <h1 className="react-coming-title mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            React Visualizations{" "}
            <span className="react-coming-title-accent">Coming Soon</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300/85 sm:text-base lg:text-lg">
            We are redesigning the React section with richer simulations, cleaner
            controls, and smoother playback for core rendering concepts.
          </p>

          <div className="mt-8 grid w-full gap-3 sm:grid-cols-3">
            {PREVIEW_ITEMS.map((item, index) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="react-coming-preview-card rounded-2xl p-4 text-left"
                  style={
                    {
                      "--react-coming-card-delay": `${index * 0.85}s`,
                    } as CSSProperties
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="react-coming-preview-icon inline-flex h-7 w-7 items-center justify-center rounded-lg border">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h2 className="text-sm font-semibold text-slate-100">{item.title}</h2>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300/80">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
