"use client";

import dynamic from "next/dynamic";
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { SandboxErrorDisplay } from "@/components/sandbox/SandboxErrorDisplay";
import type { useSandboxMode } from "@/hooks/useSandboxMode";
import type { SandboxConfig } from "@/types/sandbox";

const SandboxEditor = dynamic(
  () =>
    import("@/components/sandbox/SandboxEditor").then((module) => ({
      default: module.SandboxEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] animate-pulse rounded-lg bg-slate-800/50" />
    ),
  },
);

type SandboxState = ReturnType<typeof useSandboxMode>;

interface SandboxPanelProps {
  config: SandboxConfig;
  sandbox: Pick<
    SandboxState,
    "userCode" | "codeVersion" | "setUserCode" | "error"
  >;
  onGenerate: () => void;
  className?: string;
}

/** The editor panel that stands in for Source Code while the sandbox is being edited. */
export const SandboxPanel = ({
  config,
  sandbox,
  onGenerate,
  className,
}: SandboxPanelProps) => (
  <NeonPanel
    title="Sandbox"
    tone="green"
    bodyClassName="font-mono text-[13px] leading-[1.9] text-slate-200"
    className={className}
  >
    <SandboxEditor
      code={sandbox.userCode}
      codeVersion={sandbox.codeVersion}
      onChange={sandbox.setUserCode}
      onGenerate={onGenerate}
      maxLines={config.maxCodeLines}
    />
    {sandbox.error && (
      <SandboxErrorDisplay
        error={sandbox.error}
        supportedPatterns={config.supportedPatterns}
      />
    )}
    <p className="mt-2 text-[11px] text-slate-500">
      Limited to {config.maxCodeLines} lines &middot; {config.maxCodeLength}{" "}
      characters
    </p>
  </NeonPanel>
);
