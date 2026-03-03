export type OnboardingTourStepId =
  | "transport"
  | "sandbox"
  | "theory"
  | "linkedin";

export interface OnboardingTourStepCopy {
  id: OnboardingTourStepId;
  sectionLabel: string;
  title: string;
  description: string;
  mobileHighlights: string[];
}

export const ONBOARDING_TOUR_STEP_COPY: OnboardingTourStepCopy[] = [
  {
    id: "transport",
    sectionLabel: "Controls",
    title: "Control every animation frame",
    description:
      "Run visuals automatically or move step by step so users can inspect what the engine does at each point.",
    mobileHighlights: [
      "Reset restarts the visualization from step 1.",
      "Step Back and Step Forward move one frame at a time.",
      "Play/Pause auto-runs the full sequence.",
      "Speed adjusts playback from 0.25x to 2x.",
    ],
  },
  {
    id: "sandbox",
    sectionLabel: "Sandbox",
    title: "Use the sandbox workflow",
    description:
      "Switch into sandbox, edit code, generate steps, then return to editing whenever you want to iterate.",
    mobileHighlights: [
      "Use the sandbox toggle to enter custom mode.",
      "Generate turns your code into animation steps.",
      "Edit returns from playback to the code editor.",
      "Reset puts the default starter code back.",
    ],
  },
  {
    id: "theory",
    sectionLabel: "Theory",
    title: "Open theory for deeper explanations",
    description:
      "Each topic includes a theory page with fundamentals, common mistakes, and interview-style framing.",
    mobileHighlights: [
      "Theory opens detailed conceptual notes for the topic.",
      "Use theory together with the visualizer for faster understanding.",
      "Docs icon links to external references for extra depth.",
    ],
  },
  {
    id: "linkedin",
    sectionLabel: "Updates",
    title: "Follow for new tips and releases",
    description:
      "The LinkedIn follow CTA is available in the sidebar for updates, practical breakdowns, and new concept drops.",
    mobileHighlights: [
      "Use the sidebar follow button to get new content.",
      "Expect practical internals tips beyond current topics.",
      "Share feedback and feature ideas through LinkedIn.",
    ],
  },
];
