import { describe, expect, it } from "vitest";

import { normalizeUrl, validateAlias } from "./url.js";

describe("normalizeUrl", () => {
  it("accepts http and https urls", () => {
    expect(normalizeUrl("https://example.com/docs")).toBe("https://example.com/docs");
  });

  it("rejects unsafe schemes", () => {
    expect(() => normalizeUrl("javascript:alert(1)")).toThrow("Only http and https");
    expect(() => normalizeUrl("data:text/html,hello")).toThrow("Only http and https");
  });

  it("rejects malformed urls", () => {
    expect(() => normalizeUrl("not a url")).toThrow("valid absolute URL");
  });
});

describe("validateAlias", () => {
  it("allows readable custom aliases", () => {
    expect(validateAlias("launch-2026")).toBe("launch-2026");
  });

  it("rejects aliases with spaces or punctuation", () => {
    expect(() => validateAlias("bad alias")).toThrow("Aliases must");
    expect(() => validateAlias("x")).toThrow("Aliases must");
  });
});
