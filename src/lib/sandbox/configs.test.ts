import { describe, expect, it } from "vitest";
import {
  SANDBOX_CONFIGS,
  getSandboxConfig,
  isSandboxEnabled,
} from "@/lib/sandbox/configs";
import { generateEventLoopSteps } from "@/lib/sandbox/generators/event-loop";
import { parseUserCode } from "@/lib/sandbox/parser";
import { isTopicId } from "@/lib/topics";

describe("sandbox configs", () => {
  it("keys every config by a real topic id that matches its topicId", () => {
    expect(Object.keys(SANDBOX_CONFIGS).length).toBeGreaterThan(0);
    for (const [key, config] of Object.entries(SANDBOX_CONFIGS)) {
      expect(config.topicId).toBe(key);
      expect(isTopicId(key)).toBe(true);
    }
  });

  it("ships default code that fits its own limits", () => {
    for (const config of Object.values(SANDBOX_CONFIGS)) {
      expect(config.defaultCode.length).toBeLessThanOrEqual(
        config.maxCodeLength,
      );
      expect(config.defaultCode.split("\n").length).toBeLessThanOrEqual(
        config.maxCodeLines,
      );
      expect(config.supportedPatterns.length).toBeGreaterThan(0);
    }
  });

  it("ships event loop default code that parses and generates steps", () => {
    const parsed = parseUserCode(SANDBOX_CONFIGS["event-loop"].defaultCode);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    const result = generateEventLoopSteps(
      parsed.ast,
      SANDBOX_CONFIGS["event-loop"].defaultCode,
    );
    expect(result.success).toBe(true);
  });
});

describe("isSandboxEnabled", () => {
  it("is true only for topics with a config", () => {
    expect(isSandboxEnabled("event-loop")).toBe(true);
    expect(isSandboxEnabled("closures")).toBe(false);
    expect(isSandboxEnabled("")).toBe(false);
  });

  it("ignores properties inherited from Object.prototype", () => {
    expect(isSandboxEnabled("toString")).toBe(false);
    expect(isSandboxEnabled("constructor")).toBe(false);
  });
});

describe("getSandboxConfig", () => {
  it("returns the config or null", () => {
    expect(getSandboxConfig("event-loop")).toBe(SANDBOX_CONFIGS["event-loop"]);
    expect(getSandboxConfig("closures")).toBeNull();
    expect(getSandboxConfig("toString")).toBeNull();
  });
});
