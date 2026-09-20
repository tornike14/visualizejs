import { describe, expect, it } from "vitest";
import { cn, noop } from "@/lib/utils";

describe("cn", () => {
  it("joins class names and drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b", 0 && "c")).toBe("a b");
  });

  it("supports arrays and object syntax", () => {
    expect(cn(["a", { b: true, c: false }], { d: true })).toBe("a b d");
  });

  it("lets later Tailwind utilities win over conflicting earlier ones", () => {
    expect(cn("p-2 text-slate-400", "p-4")).toBe("text-slate-400 p-4");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("keeps non-conflicting utilities", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("returns an empty string with no input", () => {
    expect(cn()).toBe("");
  });
});

describe("noop", () => {
  it("returns undefined and ignores arguments", () => {
    expect(noop()).toBeUndefined();
  });
});
