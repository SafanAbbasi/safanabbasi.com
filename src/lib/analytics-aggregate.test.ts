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

  it("returns zeros for empty array", () => {
    const result = aggregateAnalyticsFromClicks([]);

    expect(result.totalClicks).toBe(0);
    expect(result.weeklyClicks).toBe(0);
    expect(result.clicksPerLink).toEqual([]);
    expect(result.dailyClicks).toEqual([]);
  });

  it("groups daily clicks and sorts by date", () => {
    const day1 = "2026-04-10T08:00:00Z";
    const day2 = "2026-04-11T14:00:00Z";

    const result = aggregateAnalyticsFromClicks([
      { link_id: "a", clicked_at: day2 },
      { link_id: "a", clicked_at: day1 },
      { link_id: "b", clicked_at: day1 },
    ]);

    expect(result.dailyClicks).toEqual([
      { date: "2026-04-10", count: 2 },
      { date: "2026-04-11", count: 1 },
    ]);
  });

  it("excludes clicks older than 30 days from dailyClicks", () => {
    const old = new Date();
    old.setDate(old.getDate() - 31);

    const result = aggregateAnalyticsFromClicks([
      { link_id: "a", clicked_at: old.toISOString() },
    ]);

    expect(result.totalClicks).toBe(1);
    expect(result.dailyClicks).toEqual([]);
  });
});
