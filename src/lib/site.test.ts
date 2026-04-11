import { describe, expect, it } from "vitest";
import { absoluteSiteUrl, site } from "./site";

describe("site", () => {
  it("absoluteSiteUrl joins paths", () => {
    expect(absoluteSiteUrl()).toBe(site.canonicalUrl);
    expect(absoluteSiteUrl("/sitemap.xml")).toBe(`${site.canonicalUrl}/sitemap.xml`);
    expect(absoluteSiteUrl("about")).toBe(`${site.canonicalUrl}/about`);
  });
});
