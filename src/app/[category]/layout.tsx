import type { ReactNode } from "react";
import { OnboardingTourModal } from "@/components/onboarding/OnboardingTourModal";

interface CategoryLayoutProps {
  children: ReactNode;
}

export default function CategoryLayout({ children }: CategoryLayoutProps) {
  return (
    <>
      {children}
      <OnboardingTourModal />
    </>
  );
}
