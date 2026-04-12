import { describe, expect, it } from "vitest";
import {
  isValidLinkIdShape,
  parseRedirectClickSlug,
  REDIRECT_CLICK_PREFIX,
} from "./click-validation";

describe("parseRedirectClickSlug", () => {
  it("returns slug for redirect pattern", () => {
    expect(parseRedirectClickSlug(`${REDIRECT_CLICK_PREFIX}github`)).toBe(
      "github"
    );
  });

  it("returns null for plain link ids", () => {
    expect(parseRedirectClickSlug("github")).toBeNull();
  });

  it("returns null for empty slug", () => {
    expect(parseRedirectClickSlug(`${REDIRECT_CLICK_PREFIX}`)).toBeNull();
    expect(parseRedirectClickSlug(`${REDIRECT_CLICK_PREFIX}  `)).toBeNull();
  });
});

describe("isValidLinkIdShape", () => {
  it("accepts non-empty strings within max length", () => {
    expect(isValidLinkIdShape("a")).toBe(true);
    expect(isValidLinkIdShape("github")).toBe(true);
  });

  it("rejects non-strings and empty", () => {
    expect(isValidLinkIdShape(null)).toBe(false);
    expect(isValidLinkIdShape(1)).toBe(false);
    expect(isValidLinkIdShape("")).toBe(false);
  });

  it("accepts string at max length (512)", () => {
    expect(isValidLinkIdShape("a".repeat(512))).toBe(true);
  });

  it("rejects string over max length", () => {
    expect(isValidLinkIdShape("a".repeat(513))).toBe(false);
  });
});
