import { PreviewShell } from "@/components/onboarding/components/PreviewShell";
import { TransportControls } from "@/components/visualization-ui/TransportControls";
import { noop } from "@/lib/utils";

export const ControlsPreview = () => {
  return (
    <PreviewShell>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_58%)]" />

      <div className="relative z-10 flex min-h-[12rem] items-center justify-center lg:min-h-[13rem]">
        <div className="w-fit rounded-2xl border border-slate-600/70 bg-[rgba(11,20,39,0.85)] px-3 py-2">
          <TransportControls
            isPlaying={false}
            canStep={true}
            canStepBack={true}
            speedLevel={4}
            speedLabel="1x"
            onTogglePlay={noop}
            onStep={noop}
            onStepBack={noop}
            onReset={noop}
            onSpeedLevelChange={noop}
            className="flex-nowrap gap-3"
            tooltipConfig={{
              forceVisible: true,
              sides: {
                reset: "top",
                stepBack: "bottom",
                play: "top",
                stepForward: "bottom",
                speed: "top",
              },
            }}
          />
        </div>
      </div>
    </PreviewShell>
  );
};
