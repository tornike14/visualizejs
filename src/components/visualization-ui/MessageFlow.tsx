import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlowActor {
  id: string;
  label: string;
}

export type FlowMessageStatus = "done" | "active" | "pending" | "failed";

export interface FlowMessage {
  id: string;
  from: string;
  to: string;
  label: string;
  detail?: string;
  status: FlowMessageStatus;
}

interface MessageFlowProps {
  actors: FlowActor[];
  messages: FlowMessage[];
  activeActorId?: string;
  emptyLabel?: string;
  className?: string;
}

const MESSAGE_STYLES: Record<FlowMessageStatus, string> = {
  done: "border-emerald-300/30 bg-emerald-400/8 text-emerald-100",
  active:
    "border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.16)]",
  pending: "border-slate-700/50 bg-slate-900/40 text-slate-500",
  failed: "border-rose-400/40 bg-rose-400/10 text-rose-200",
};

/**
 * Sequence-diagram style view: actors across the top, then messages listed
 * in order with the direction between actors. Works for client/server
 * exchanges, auth handshakes, and producer/consumer flows.
 */
export const MessageFlow = ({
  actors,
  messages,
  activeActorId,
  emptyLabel = "no messages yet",
  className,
}: MessageFlowProps) => {
  const actorIndex = new Map(actors.map((actor, index) => [actor.id, index]));
  const actorLabel = (id: string) =>
    actors.find((actor) => actor.id === id)?.label ?? id;

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${actors.length}, minmax(0, 1fr))` }}
      >
        {actors.map((actor) => (
          <div
            key={actor.id}
            className={cn(
              "rounded-lg border px-2 py-1.5 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-all",
              actor.id === activeActorId
                ? "border-pink-300/50 bg-pink-400/12 text-pink-100 shadow-[0_0_16px_rgba(244,114,182,0.18)]"
                : "border-slate-600/50 bg-slate-800/50 text-slate-300",
            )}
          >
            {actor.label}
          </div>
        ))}
      </div>

      {messages.length === 0 ? (
        <p className="pt-1 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
          {emptyLabel}
        </p>
      ) : (
        <ol className="space-y-1.5">
          {messages.map((message) => {
            const fromIndex = actorIndex.get(message.from) ?? 0;
            const toIndex = actorIndex.get(message.to) ?? 0;
            const rightward = toIndex >= fromIndex;
            return (
              <li
                key={message.id}
                className={cn(
                  "viz-slide-in flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs transition-all duration-300",
                  MESSAGE_STYLES[message.status],
                )}
              >
                <span className="w-16 shrink-0 truncate text-[10px] uppercase tracking-[0.1em] opacity-70">
                  {actorLabel(message.from)}
                </span>
                {rightward ? (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                )}
                <span className="w-16 shrink-0 truncate text-[10px] uppercase tracking-[0.1em] opacity-70">
                  {actorLabel(message.to)}
                </span>
                <span className="font-semibold">{message.label}</span>
                {message.detail && (
                  <span className="truncate text-slate-400">{message.detail}</span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
