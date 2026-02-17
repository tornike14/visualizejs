"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useRef } from "react";
import Image from "next/image";

export type CategoryHeroStyle = CSSProperties & {
  "--hero-accent": string;
  "--hero-accent-soft": string;
  "--hero-secondary": string;
};

export interface CategoryHeroConfig {
  iconSrc: string;
  iconAlt: string;
  iconShellClass: string;
  title: string;
  highlightedWord: string;
  titleTail: string;
  description: string;
  titleAccentClass: string;
  kicker: string;
  kickerClass: string;
  heroStyle: CategoryHeroStyle;
}

interface CategoryHeroProps {
  config: CategoryHeroConfig;
}

export function CategoryHero({ config }: CategoryHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const shell = sectionRef.current;
    if (!shell) {
      return;
    }

    const rect = shell.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const tiltX = (0.5 - y) * 5.5;
    const tiltY = (x - 0.5) * 7.5;
    const beamShift = (x - 0.5) * 14;

    shell.style.setProperty("--category-hero-tilt-x", `${tiltX.toFixed(2)}deg`);
    shell.style.setProperty("--category-hero-tilt-y", `${tiltY.toFixed(2)}deg`);
    shell.style.setProperty("--category-hero-glow-x", `${(x * 100).toFixed(2)}%`);
    shell.style.setProperty("--category-hero-glow-y", `${(y * 100).toFixed(2)}%`);
    shell.style.setProperty(
      "--category-hero-beam-shift",
      `${beamShift.toFixed(2)}%`,
    );
  };

  const handleMouseLeave = () => {
    const shell = sectionRef.current;
    if (!shell) {
      return;
    }
    shell.style.setProperty("--category-hero-tilt-x", "0deg");
    shell.style.setProperty("--category-hero-tilt-y", "0deg");
    shell.style.setProperty("--category-hero-glow-x", "50%");
    shell.style.setProperty("--category-hero-glow-y", "40%");
    shell.style.setProperty("--category-hero-beam-shift", "0%");
  };

  return (
    <section
      ref={sectionRef}
      className="category-hero rounded-3xl px-6 pb-4 pt-10 text-center lg:px-10 lg:pb-6 lg:pt-12"
      style={config.heroStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="category-hero-tiles absolute inset-0" />
        <div className="category-hero-tiles-hotspot absolute inset-0" />
        <div className="category-hero-pointer-glow absolute inset-0" />
        <div className="category-hero-beam absolute -left-1/3 top-1/2 h-56 w-[70%] -translate-y-1/2" />
        <div className="category-hero-orb category-hero-orb-primary absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2" />
        <div className="category-hero-orb category-hero-orb-secondary absolute -right-14 top-6 h-48 w-48" />
        <div className="category-hero-orb category-hero-orb-secondary category-hero-orb-delayed absolute -left-16 bottom-0 h-44 w-44" />
        <div className="category-hero-prism absolute inset-x-8 bottom-8 h-20" />
      </div>

      <div className="relative z-[1] flex flex-col items-center gap-5">
        <p
          className={`category-hero-kicker rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${config.kickerClass}`}
        >
          {config.kicker}
        </p>

        <div className="category-hero-icon-shell">
          <span aria-hidden className="category-hero-icon-ring" />
          <div
            className={`relative z-[1] flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-3xl ${config.iconShellClass}`}
          >
            <Image
              src={config.iconSrc}
              alt={config.iconAlt}
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
          </div>
        </div>

        <h1 className="category-hero-title text-4xl font-bold tracking-tight lg:text-6xl">
          <span className={config.titleAccentClass}>{config.highlightedWord}</span>{" "}
          <span className="text-slate-100/90">{config.titleTail}</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[color:var(--app-text-secondary)] lg:text-xl">
          {config.description}
        </p>
      </div>
    </section>
  );
}
