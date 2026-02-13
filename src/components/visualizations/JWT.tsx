"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JwtPartKey = "header" | "payload" | "signature";

interface JwtPart {
  label: string;
  encoded: string;
  decoded: string;
  colorTextClass: string;
  colorBorderClass: string;
  colorBgClass: string;
}

interface JwtStep {
  id: string;
  title: string;
  description: string;
}

const JWT_PARTS: Record<JwtPartKey, JwtPart> = {
  header: {
    label: "Header",
    encoded: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    decoded: `{
  "alg": "HS256",
  "typ": "JWT"
}`,
    colorTextClass: "text-rose-300",
    colorBorderClass: "border-rose-400/40",
    colorBgClass: "bg-rose-500/12",
  },
  payload: {
    label: "Payload",
    encoded:
      "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRvcm5pa2UiLCJpYXQiOjE3MTYyMzkwMjJ9",
    decoded: `{
  "sub": "1234567890",
  "name": "Tornike",
  "iat": 1716239022
}`,
    colorTextClass: "text-violet-300",
    colorBorderClass: "border-violet-400/40",
    colorBgClass: "bg-violet-500/12",
  },
  signature: {
    label: "Signature",
    encoded: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    decoded: `HMACSHA256(
  base64Url(header) + "." +
  base64Url(payload),
  secret
)`,
    colorTextClass: "text-emerald-300",
    colorBorderClass: "border-emerald-400/40",
    colorBgClass: "bg-emerald-500/12",
  },
};

const STEPS: JwtStep[] = [
  {
    id: "intro",
    title: "What Is JWT?",
    description:
      "JSON Web Token is a compact, URL-safe format for signed claims between parties.",
  },
  {
    id: "structure",
    title: "JWT Structure",
    description:
      "A token has three Base64Url-encoded parts separated by dots: header, payload, signature.",
  },
  {
    id: "header",
    title: "1. Header",
    description:
      "Header defines metadata such as signing algorithm and token type.",
  },
  {
    id: "payload",
    title: "2. Payload",
    description:
      "Payload contains claims such as subject, roles, expiration, and custom data.",
  },
  {
    id: "signature",
    title: "3. Signature",
    description:
      "Signature protects integrity: server signs header + payload with a secret.",
  },
  {
    id: "flow",
    title: "Authentication Flow",
    description:
      "Watch how JWT is issued, stored by client, and verified by server on each request.",
  },
];

const PROGRESS_CLASSES = [
  "w-0",
  "w-1/5",
  "w-2/5",
  "w-3/5",
  "w-4/5",
  "w-full",
] as const;

const PART_STAGGER_CLASS: Record<JwtPartKey, string> = {
  header: "[animation-delay:0ms]",
  payload: "[animation-delay:100ms]",
  signature: "[animation-delay:200ms]",
};

const FLOW_PROGRESS_CLASSES = ["w-0", "w-1/4", "w-1/2", "w-3/4", "w-full"] as const;

const FLOW_TOKEN_POSITION_CLASSES = [
  "left-[50%]",
  "left-[50%]",
  "left-[72%]",
  "left-[22%]",
  "left-[50%]",
] as const;

function TokenPartCard({
  partKey,
  active,
  onToggle,
}: {
  partKey: JwtPartKey;
  active: boolean;
  onToggle: () => void;
}) {
  const part = JWT_PARTS[partKey];

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={cn(
        "w-full rounded-xl border p-4 text-left transition-all duration-300 animate-[fadeSlideIn_0.45s_ease-out_both]",
        PART_STAGGER_CLASS[partKey],
        active
          ? cn(part.colorBorderClass, part.colorBgClass, "shadow-[0_0_20px_rgba(148,163,184,0.12)]")
          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "h-2.5 w-2.5 rounded-full",
            partKey === "header" && "bg-rose-400",
            partKey === "payload" && "bg-violet-400",
            partKey === "signature" && "bg-emerald-400"
          )}
        />
        <span className={cn("text-xs font-semibold uppercase tracking-[0.08em]", part.colorTextClass)}>
          {part.label}
        </span>
      </div>

      <pre
        className={cn(
          "whitespace-pre-wrap break-all font-mono text-xs leading-relaxed",
          active ? "text-slate-100" : "text-slate-500"
        )}
      >
        {active ? part.decoded : part.encoded}
      </pre>
    </button>
  );
}

function FlowAnimation() {
  const [flowStep, setFlowStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowStep((value) => (value + 1) % 5);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const flowItems = [
    { label: "User logs in", icon: "👤" },
    { label: "Server creates JWT", icon: "🔐" },
    { label: "JWT returned to client", icon: "📨" },
    { label: "Client sends JWT with request", icon: "📤" },
    { label: "Server verifies JWT", icon: "✅" },
  ];

  const clientActive = flowStep === 0 || flowStep === 3;
  const serverActive = flowStep === 1 || flowStep === 4;
  const tokenVisible = flowStep >= 2;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-[1fr_2fr_1fr] items-center gap-3">
        <div
          className={cn(
            "rounded-2xl border p-4 text-center transition-all duration-500",
            clientActive
              ? "border-rose-400/45 bg-rose-500/15 shadow-[0_0_20px_rgba(251,113,133,0.25)]"
              : "border-white/10 bg-white/[0.02]"
          )}
        >
          <p className="text-2xl">👤</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-300">
            Client
          </p>
        </div>

        <div className="relative">
          <div className="h-[3px] w-full rounded-full bg-white/10">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r from-rose-400 via-violet-400 to-emerald-400 transition-all duration-700",
                FLOW_PROGRESS_CLASSES[flowStep]
              )}
            />
          </div>
          {tokenVisible && (
            <div
              className={cn(
                "absolute -top-4 -translate-x-1/2 text-xl transition-all duration-700",
                FLOW_TOKEN_POSITION_CLASSES[flowStep]
              )}
            >
              🎟️
            </div>
          )}
        </div>

        <div
          className={cn(
            "rounded-2xl border p-4 text-center transition-all duration-500",
            serverActive
              ? "border-emerald-400/45 bg-emerald-500/15 shadow-[0_0_20px_rgba(52,211,153,0.25)]"
              : "border-white/10 bg-white/[0.02]"
          )}
        >
          <p className="text-2xl">🖥️</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-300">
            Server
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {flowItems.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg border px-3 py-2 transition-all duration-300",
              index === flowStep
                ? "translate-x-1 border-violet-400/30 bg-violet-500/12 text-slate-100"
                : "border-transparent bg-transparent text-slate-500",
              index <= flowStep ? "opacity-100" : "opacity-40"
            )}
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
            {index === flowStep && (
              <span className="ml-auto h-2 w-2 animate-pulse rounded-full bg-violet-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function JWT() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPart, setSelectedPart] = useState<JwtPartKey | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= STEPS.length - 1;
  const current = STEPS[currentStep];
  const autoHighlightedPart: JwtPartKey | null =
    currentStep === 2
      ? "header"
      : currentStep === 3
        ? "payload"
        : currentStep === 4
          ? "signature"
          : null;
  const activePart = selectedPart ?? autoHighlightedPart;

  useEffect(() => {
    if (!isAutoPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setSelectedPart(null);
      setCurrentStep((value) => {
        if (value >= STEPS.length - 1) {
          setIsAutoPlaying(false);
          return value;
        }
        return value + 1;
      });
    }, 3600);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleToggleAutoplay = useCallback(() => {
    if (!isAutoPlaying && isLastStep) {
      setCurrentStep(0);
    }
    setSelectedPart(null);
    setIsAutoPlaying((value) => !value);
  }, [isAutoPlaying, isLastStep]);

  const handlePrevious = useCallback(() => {
    setIsAutoPlaying(false);
    setSelectedPart(null);
    setCurrentStep((value) => Math.max(0, value - 1));
  }, []);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setSelectedPart(null);
    setCurrentStep((value) => Math.min(STEPS.length - 1, value + 1));
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#090b12] p-5 lg:p-8">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatPulse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6">
        <header className="text-center">
          <Badge
            variant="outline"
            className="border-violet-400/30 bg-violet-500/10 text-violet-200"
          >
            Interactive Guide
          </Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-transparent bg-gradient-to-r from-rose-300 via-violet-300 to-emerald-300 bg-clip-text">
            How JWT Works
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Visual breakdown of token structure and authentication flow.
          </p>
        </header>

        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>
              Step {currentStep + 1} / {STEPS.length}
            </span>
            <span>{Math.round((currentStep / (STEPS.length - 1)) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r from-rose-400 via-violet-400 to-emerald-400 transition-all duration-500",
                PROGRESS_CLASSES[currentStep]
              )}
            />
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setSelectedPart(null);
                  setCurrentStep(index);
                }}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-300",
                  index === currentStep
                    ? "w-8 bg-gradient-to-r from-rose-400 to-violet-400"
                    : index < currentStep
                      ? "w-2.5 bg-violet-400"
                      : "w-2.5 bg-white/20"
                )}
                aria-label={`Go to ${step.title}`}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur">
          <h3 className="text-xl font-semibold text-slate-100">{current.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            {current.description}
          </p>

          {isFirstStep && (
            <div className="flex justify-center py-8">
              <div className="text-7xl animate-[floatPulse_3s_ease-in-out_infinite]">🔐</div>
            </div>
          )}

          {currentStep >= 1 && currentStep <= 4 && (
            <div className="mt-5 space-y-4">
              <div className="rounded-xl border border-white/10 bg-black/35 p-4 font-mono text-[11px] leading-relaxed break-all">
                <span className={JWT_PARTS.header.colorTextClass}>
                  {JWT_PARTS.header.encoded}
                </span>
                <span className="text-slate-600">.</span>
                <span className={JWT_PARTS.payload.colorTextClass}>
                  {JWT_PARTS.payload.encoded}
                </span>
                <span className="text-slate-600">.</span>
                <span className={JWT_PARTS.signature.colorTextClass}>
                  {JWT_PARTS.signature.encoded}
                </span>
              </div>

              <div className="space-y-2.5">
                {(["header", "payload", "signature"] as const).map((partKey) => (
                  <TokenPartCard
                    key={partKey}
                    partKey={partKey}
                    active={activePart === partKey}
                    onToggle={() =>
                      setSelectedPart((value) => (value === partKey ? null : partKey))
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="mt-5 rounded-xl border border-white/10 bg-black/25 p-4">
              <FlowAnimation />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
          <Button variant="outline" onClick={handlePrevious} disabled={isFirstStep}>
            ← Previous
          </Button>
          <Button variant="outline" onClick={handleToggleAutoplay}>
            {isAutoPlaying ? "Pause" : "Auto Play"}
          </Button>
          <Button onClick={handleNext} disabled={isLastStep}>
            Next →
          </Button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Tip: Click any token section to toggle encoded and decoded views.
        </p>
      </div>
    </section>
  );
}

export default JWT;
