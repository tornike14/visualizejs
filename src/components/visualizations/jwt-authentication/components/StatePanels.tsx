import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { MessageFlow } from "@/components/visualization-ui/MessageFlow";
import { MetricBars } from "@/components/visualization-ui/MetricBars";
import type { JwtKind, JwtStep } from "../types";
import { TokenParts } from "./TokenParts";
import { ClaimsTable } from "./ClaimsTable";
import { VerificationChecklist } from "./VerificationChecklist";
import { ServerStore } from "./ServerStore";

const ACTORS = [
  { id: "client", label: "Client" },
  { id: "server", label: "Server" },
];

const REFRESH_ACTORS = [
  { id: "client", label: "Client" },
  { id: "server", label: "Server" },
  { id: "db", label: "DB" },
];

export type JwtFlashes = Record<
  "tokenParts" | "messages" | "claims" | "checks" | "lifetimes" | "store",
  boolean
>;

interface StatePanelsProps {
  kind: JwtKind;
  step: JwtStep | null;
  flashes: JwtFlashes;
}

const flash = (on: boolean) => (on ? "viz-change-flash" : undefined);

export const StatePanels = ({ kind, step, flashes }: StatePanelsProps) => {
  const messagesPanel = (
    <NeonPanel
      title="Messages"
      tone="green"
      bodyClassName="min-h-[8rem]"
      className={flash(flashes.messages)}
    >
      <MessageFlow
        actors={kind === "refresh" ? REFRESH_ACTORS : ACTORS}
        messages={step?.messages ?? []}
        activeActorId={step?.activeActorId}
      />
    </NeonPanel>
  );

  if (kind === "refresh") {
    return (
      <div className="space-y-4">
        <NeonPanel
          title="Token Lifetimes"
          tone="cyan"
          bodyClassName="min-h-[5rem]"
          className={flash(flashes.lifetimes)}
        >
          <MetricBars
            bars={step?.lifetimes ?? []}
            emptyLabel="no tokens issued"
          />
        </NeonPanel>
        {messagesPanel}
        <NeonPanel
          title="Server Store"
          tone="violet"
          bodyClassName="min-h-[6rem]"
          className={flash(flashes.store)}
        >
          <ServerStore entries={step?.store ?? []} />
        </NeonPanel>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <NeonPanel
          title="Token Parts"
          tone="cyan"
          bodyClassName="min-h-[10rem]"
          className={flash(flashes.tokenParts)}
        >
          <TokenParts parts={step?.tokenParts ?? []} />
        </NeonPanel>
        {kind === "issue" ? (
          <NeonPanel
            title="Claims"
            tone="violet"
            bodyClassName="min-h-[10rem]"
            className={flash(flashes.claims)}
          >
            <ClaimsTable claims={step?.claims ?? []} />
          </NeonPanel>
        ) : (
          <NeonPanel
            title="Verification Steps"
            tone="violet"
            bodyClassName="min-h-[10rem]"
            className={flash(flashes.checks)}
          >
            <VerificationChecklist checks={step?.checks ?? []} />
          </NeonPanel>
        )}
      </div>
      {messagesPanel}
    </div>
  );
};
