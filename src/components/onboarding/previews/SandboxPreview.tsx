import { ArrowLeft, ArrowRight, Pencil, Play, RotateCcw } from "lucide-react";
import { PreviewShell } from "@/components/onboarding/components/PreviewShell";
import { SandboxToggle } from "@/components/sandbox/SandboxToggle";
import { Tooltip } from "@/components/visualization-ui/Tooltip";
import { cn, noop } from "@/lib/utils";

const previewIconButtonClass =
  "inline-flex cursor-pointer items-center justify-center rounded-lg border p-2 transition-all";

export const SandboxPreview = () => {
  return (
    <PreviewShell>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.16),transparent_44%)]" />

      <div className="relative z-10 flex min-h-[12rem] items-center justify-center lg:min-h-[13rem]">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-8">
          <SandboxToggle
            isActive={false}
            onToggle={noop}
            tooltipForceVisible={true}
            tooltipSide="top"
          />

          <ArrowRight className="h-4 w-4 text-emerald-300/80" />

          <div className="flex items-center gap-3">
            <Tooltip label="Generate" forceVisible={true} side="top">
              <button
                type="button"
                className={cn(
                  previewIconButtonClass,
                  "border-emerald-300/45 bg-gradient-to-br from-emerald-500/30 to-cyan-400/18 text-emerald-200",
                )}
                aria-label="Generate"
              >
                <Play className="h-4 w-4 fill-current" />
              </button>
            </Tooltip>

            <Tooltip label="Reset code" forceVisible={true} side="bottom">
              <button
                type="button"
                className={cn(
                  previewIconButtonClass,
                  "border-slate-600/85 bg-slate-900/65 text-slate-100",
                )}
                aria-label="Reset code"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>

          <ArrowLeft className="h-4 w-4 text-emerald-300/80" />

          <Tooltip label="Edit code" forceVisible={true} side="top">
            <button
              type="button"
              className={cn(
                previewIconButtonClass,
                "border-emerald-300/45 bg-gradient-to-br from-emerald-500/30 to-cyan-400/18 text-emerald-200",
              )}
              aria-label="Edit code"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </PreviewShell>
  );
};
