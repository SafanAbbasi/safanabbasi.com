import { describe, expect, it } from "vitest";
import { isKnownLinkIconKey, KNOWN_LINK_ICON_KEYS } from "./link-icons";

describe("isKnownLinkIconKey", () => {
  it.each([...KNOWN_LINK_ICON_KEYS])("accepts known key %s", (key) => {
    expect(isKnownLinkIconKey(key)).toBe(true);
  });

  it("rejects unknown strings", () => {
    expect(isKnownLinkIconKey("Nonexistent")).toBe(false);
    expect(isKnownLinkIconKey("code")).toBe(false); // case-sensitive
  });

  it("rejects null and undefined", () => {
    expect(isKnownLinkIconKey(null)).toBe(false);
    expect(isKnownLinkIconKey(undefined)).toBe(false);
  });
});
