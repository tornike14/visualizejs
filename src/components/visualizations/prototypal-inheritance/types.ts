import type {
  SourceLine,
  ChainHighlight,
  BaseStep,
} from "@/types/visualization";

export type ExampleKind = "object-create" | "constructor" | "lookup";

export interface ProtoProperty {
  name: string;
  value: string;
}

export interface ProtoObject {
  label: string;
  properties: ProtoProperty[];
  highlight?: ChainHighlight;
  activeProperty?: string;
}

export interface ProtoStep extends BaseStep {
  chain: ProtoObject[];
  activeLink?: number;
  consoleOutput: string[];
}

export interface ProtoExample {
  id: string;
  title: string;
  kind: ExampleKind;
  description: string;
  codeLines: SourceLine[];
  steps: ProtoStep[];
}
