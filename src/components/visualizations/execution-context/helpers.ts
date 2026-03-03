import type { Binding, ExecutionContextEntry } from "./types";

export function phaseColors(phase: "creation" | "execution") {
  return phase === "creation"
    ? {
        border: "border-violet-300/40",
        bg: "bg-violet-400/10",
        shadow: "shadow-[0_0_18px_rgba(196,181,253,0.1)]",
        text: "text-violet-300",
        badgeBg: "bg-violet-500/20",
        badgeBorder: "border-violet-500/25",
      }
    : {
        border: "border-emerald-300/40",
        bg: "bg-emerald-400/10",
        shadow: "shadow-[0_0_18px_rgba(52,211,153,0.1)]",
        text: "text-emerald-300",
        badgeBg: "bg-emerald-500/20",
        badgeBorder: "border-emerald-500/25",
      };
}

export function kindBadge(kind: Binding["kind"]): { label: string; className: string } {
  switch (kind) {
    case "var":
      return { label: "var", className: "text-amber-300 bg-amber-500/15" };
    case "function":
      return { label: "fn", className: "text-blue-300 bg-blue-500/15" };
    case "param":
      return { label: "arg", className: "text-cyan-300 bg-cyan-500/15" };
  }
}

export function ecFingerprint(ec: ExecutionContextEntry): string {
  const bindings = ec.variableEnv
    .map((b) => `${b.name}:${b.value}:${b.initialized}`)
    .join(",");
  return `${ec.id}|${ec.phase}|${bindings}`;
}
