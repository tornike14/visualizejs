import type { ComponentType } from "react";
import type { OnboardingTourStepCopy } from "@/content/static/onboarding/tourCopy";

export type OnboardingTourStepLayout = "split" | "compact";

export interface OnboardingTourStep extends OnboardingTourStepCopy {
  Preview: ComponentType;
  layout: OnboardingTourStepLayout;
}
