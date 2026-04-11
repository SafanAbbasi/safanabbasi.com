import { describe, expect, it } from "vitest";
import { clicksRowToCsvLine, escapeCsvField } from "./csv";

describe("escapeCsvField", () => {
  it("returns empty for nullish", () => {
    expect(escapeCsvField(null)).toBe("");
    expect(escapeCsvField(undefined)).toBe("");
    expect(escapeCsvField("")).toBe("");
  });

  it("wraps fields with comma or newline", () => {
    expect(escapeCsvField('say "hi", there')).toBe('"say ""hi"", there"');
    expect(escapeCsvField("a\nb")).toBe('"a\nb"');
  });
});

describe("clicksRowToCsvLine", () => {
  it("joins columns with escaped referrer", () => {
    const line = clicksRowToCsvLine({
      link_id: "github",
      clicked_at: "2026-01-01T00:00:00Z",
      referrer: 'https://x.com?q=1,2',
      user_agent: null,
    });
    expect(line).toContain("github");
    expect(line).toContain("2026-01-01T00:00:00Z");
    expect(line).toMatch(/"https:\/\/x\.com\?q=1,2"/);
  });
});
