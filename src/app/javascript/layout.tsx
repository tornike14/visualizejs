import type { ReactNode } from "react";
import { OnboardingTourModal } from "@/components/onboarding/OnboardingTourModal";

interface JavaScriptLayoutProps {
  children: ReactNode;
}

export default function JavaScriptLayout({ children }: JavaScriptLayoutProps) {
  return (
    <>
      {children}
      <OnboardingTourModal />
    </>
  );
}
