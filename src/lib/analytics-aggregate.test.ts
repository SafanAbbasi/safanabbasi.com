import { describe, expect, it } from "vitest";
import { aggregateAnalyticsFromClicks } from "./analytics-aggregate";

describe("aggregateAnalyticsFromClicks", () => {
  it("counts per link and totals", () => {
    const now = new Date();
    const old = new Date(now);
    old.setDate(old.getDate() - 10);

    const result = aggregateAnalyticsFromClicks([
      { link_id: "a", clicked_at: now.toISOString() },
      { link_id: "a", clicked_at: now.toISOString() },
      { link_id: "b", clicked_at: old.toISOString() },
    ]);

    expect(result.totalClicks).toBe(3);
    expect(result.clicksPerLink.find((c) => c.link_id === "a")?.count).toBe(2);
    expect(result.weeklyClicks).toBeGreaterThanOrEqual(2);
  });
});
