import type { ReactNode } from "react";
import { OnboardingTourModal } from "@/components/onboarding/OnboardingTourModal";

interface ReactLayoutProps {
  children: ReactNode;
}

export default function ReactLayout({ children }: ReactLayoutProps) {
  return (
    <>
      {children}
      <OnboardingTourModal />
    </>
  );
}
