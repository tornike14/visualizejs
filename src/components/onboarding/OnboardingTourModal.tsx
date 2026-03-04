"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { ONBOARDING_TOUR_STEPS } from "@/components/onboarding/onboardingTourSteps";
import {
  ONBOARDING_TOUR_DELAY_MS,
  hasSeenOnboardingTour,
  isOnboardingTourPathEligible,
  markOnboardingTourSeen,
} from "@/components/onboarding/onboardingTourStorage";
import type { OnboardingTourStep } from "@/components/onboarding/types";
import { StepCarousel } from "@/components/ui/StepCarousel";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export const OnboardingTourModal = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const isCompactStep = ONBOARDING_TOUR_STEPS[activeStep]?.layout === "compact";
  const closeTour = useCallback(() => {
    markOnboardingTourSeen();
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOnboardingTourPathEligible(pathname)) return;
    if (hasSeenOnboardingTour()) return;

    const timerId = window.setTimeout(() => {
      setActiveStep(0);
      setIsOpen(true);
    }, ONBOARDING_TOUR_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeTour();
      }
      if (event.key === "ArrowRight") {
        setActiveStep((current) =>
          Math.min(current + 1, ONBOARDING_TOUR_STEPS.length - 1),
        );
      }
      if (event.key === "ArrowLeft") {
        setActiveStep((current) => Math.max(current - 1, 0));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeTour]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-start justify-center bg-slate-950/82 px-4 py-6 backdrop-blur-sm lg:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-tour-title"
    >
      <div
        className={cn(
          "relative max-h-[calc(100svh-3rem)] w-full overflow-y-auto rounded-3xl border border-slate-500/55 bg-[linear-gradient(180deg,rgba(12,21,41,0.96),rgba(9,15,29,0.98))] shadow-[0_26px_56px_rgba(2,6,23,0.65)] transition-[max-width] duration-300 ease-out",
          isCompactStep ? "max-w-3xl" : "max-w-[58rem]",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,0.2),transparent_42%),radial-gradient(circle_at_86%_95%,rgba(244,114,182,0.14),transparent_42%)]" />

        <div className="relative p-5 lg:p-7">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200/85 uppercase">
                Welcome
              </p>
              <h2
                id="onboarding-tour-title"
                className="mt-1 text-2xl font-semibold tracking-tight text-slate-100 lg:text-3xl"
              >
                VisualizeJS quick tour
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Step {activeStep + 1} of {ONBOARDING_TOUR_STEPS.length}
              </p>
            </div>

            <button
              type="button"
              onClick={closeTour}
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-500/60 bg-slate-900/60 p-2 text-slate-300 transition-colors hover:border-slate-400/80 hover:text-slate-100"
              aria-label="Close onboarding"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <StepCarousel<OnboardingTourStep>
            items={ONBOARDING_TOUR_STEPS}
            activeIndex={activeStep}
            onIndexChange={setActiveStep}
            getItemId={(step) => step.id}
            renderSlide={(step) => <OnboardingStepSlide step={step} />}
            contentClassName={cn(
              "min-h-[22rem] lg:min-h-[20rem]",
              isCompactStep && "min-h-[17rem] lg:min-h-[15.5rem]",
            )}
            previousLabel="Previous"
            nextLabel="Next"
            finishLabel="Start exploring"
            onFinish={closeTour}
          />
        </div>
      </div>
    </div>
  );
};

interface OnboardingStepSlideProps {
  step: OnboardingTourStep;
}

const OnboardingStepSlide = ({ step }: OnboardingStepSlideProps) => {
  const Preview = step.Preview;
  const isCompactLayout = step.layout === "compact";

  if (isCompactLayout) {
    return (
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-3 lg:gap-4">
        <div className="mx-auto w-full max-w-md">
          <Preview />
        </div>

        <OnboardingStepDetails
          step={step}
          className="mx-auto w-full"
          highlightsClassName="sm:grid-cols-2"
        />
      </div>
    );
  }

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="min-w-0">
        <Preview />
      </div>

      <OnboardingStepDetails step={step} />
    </div>
  );
};

interface OnboardingStepDetailsProps {
  step: OnboardingTourStep;
  className?: string;
  highlightsClassName?: string;
}

const OnboardingStepDetails = ({
  step,
  className,
  highlightsClassName,
}: OnboardingStepDetailsProps) => {
  return (
    <section className={cn("app-surface-subtle h-full rounded-2xl p-4 lg:p-5", className)}>
      <p className="text-xs font-semibold tracking-[0.14em] text-pink-200/85 uppercase">
        {step.sectionLabel}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-slate-100 lg:text-2xl">{step.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate-300 lg:text-base">
        {step.description}
      </p>

      <ul className={cn("mt-4 grid gap-2 lg:gap-2.5", highlightsClassName)}>
        {step.mobileHighlights.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-slate-600/70 bg-slate-900/65 px-3 py-2 text-xs leading-relaxed text-slate-300 lg:text-[13px]"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
};
