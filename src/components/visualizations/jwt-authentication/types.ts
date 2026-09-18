import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { FlowMessage } from "@/components/visualization-ui/MessageFlow";
import type { MetricBar } from "@/components/visualization-ui/MetricBars";

export type JwtKind = "issue" | "verify" | "refresh";

export type TokenPartId = "header" | "payload" | "signature";

export type TokenPartState = "idle" | "active" | "encoded" | "match" | "miss";

export interface TokenPart {
  id: TokenPartId;
  /** Human readable form: JSON for header and payload, the formula for the signature. */
  decoded: string;
  /** base64url form, empty until the part has been encoded. */
  encoded: string;
  state: TokenPartState;
}

export type ClaimState = "neutral" | "active" | "ok" | "fail";

export interface ClaimRow {
  claim: string;
  value: string;
  meaning: string;
  state: ClaimState;
}

export type CheckStatus = "pending" | "active" | "pass" | "fail" | "skipped";

export interface VerificationCheck {
  id: string;
  label: string;
  detail: string;
  status: CheckStatus;
}

export type StoreEntryStatus = "active" | "rotated" | "revoked";

export interface StoreEntry {
  id: string;
  tokenHash: string;
  userId: string;
  expires: string;
  status: StoreEntryStatus;
  active?: boolean;
}

export interface JwtStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  tokenParts: TokenPart[];
  messages: FlowMessage[];
  activeActorId?: string;
  claims: ClaimRow[];
  checks: VerificationCheck[];
  lifetimes: MetricBar[];
  store: StoreEntry[];
}

export interface JwtExample extends ExampleOption {
  kind: JwtKind;
  codeLines: SourceLine[];
  steps: JwtStep[];
}
