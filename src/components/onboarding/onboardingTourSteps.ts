import { ControlsPreview } from "@/components/onboarding/previews/ControlsPreview";
import { LinkedInPreview } from "@/components/onboarding/previews/LinkedInPreview";
import { SandboxPreview } from "@/components/onboarding/previews/SandboxPreview";
import { TheoryPreview } from "@/components/onboarding/previews/TheoryPreview";
import type { OnboardingTourStep } from "@/components/onboarding/types";
import {
  ONBOARDING_TOUR_STEP_COPY,
  type OnboardingTourStepId,
} from "@/content/static/onboarding/tourCopy";

const PREVIEW_BY_ID: Record<OnboardingTourStepId, OnboardingTourStep["Preview"]> = {
  transport: ControlsPreview,
  sandbox: SandboxPreview,
  theory: TheoryPreview,
  linkedin: LinkedInPreview,
};

const LAYOUT_BY_ID: Record<OnboardingTourStepId, OnboardingTourStep["layout"]> = {
  transport: "split",
  sandbox: "split",
  theory: "compact",
  linkedin: "compact",
};

export const ONBOARDING_TOUR_STEPS: OnboardingTourStep[] = ONBOARDING_TOUR_STEP_COPY.map(
  (stepCopy) => ({
    ...stepCopy,
    Preview: PREVIEW_BY_ID[stepCopy.id],
    layout: LAYOUT_BY_ID[stepCopy.id],
  }),
);
