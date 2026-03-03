import { FollowLinkedInButton } from "@/components/layout/FollowLinkedInButton";
import { PreviewShell } from "@/components/onboarding/components/PreviewShell";

export const LinkedInPreview = () => {
  return (
    <PreviewShell className="min-h-[8.75rem] px-3 py-3 lg:min-h-[9.5rem] lg:px-4 lg:py-3.5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(34,211,238,0.16),transparent_42%)]" />

      <div className="relative z-10 flex min-h-[6.5rem] items-center justify-center lg:min-h-[7rem]">
        <FollowLinkedInButton
          size="large"
          trackLocation="onboarding"
        />
      </div>
    </PreviewShell>
  );
};
