import { TopicTheoryButton } from "@/components/layout/TopicTheoryButton";
import { PreviewShell } from "@/components/onboarding/components/PreviewShell";

export const TheoryPreview = () => {
  return (
    <PreviewShell className="min-h-[8.75rem] px-3 py-3 lg:min-h-[9.5rem] lg:px-4 lg:py-3.5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_86%_16%,rgba(56,189,248,0.15),transparent_45%)]" />

      <div className="relative z-10 flex min-h-[6.5rem] items-center justify-center lg:min-h-[7rem]">
        <TopicTheoryButton
          href="/javascript/event-loop/theory"
          size="large"
          isPreview={true}
        />
      </div>
    </PreviewShell>
  );
};
