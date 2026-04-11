export type ClickRow = {
  link_id: string;
  clicked_at: string;
};

export type AnalyticsPayload = {
  clicksPerLink: { link_id: string; count: number }[];
  dailyClicks: { date: string; count: number }[];
  totalClicks: number;
  weeklyClicks: number;
};

/** In-memory aggregation when DB RPCs are unavailable (same semantics as previous API). */
export function aggregateAnalyticsFromClicks(clicks: ClickRow[]): AnalyticsPayload {
  const clickCounts: Record<string, number> = {};
  clicks.forEach((row) => {
    clickCounts[row.link_id] = (clickCounts[row.link_id] || 0) + 1;
  });

  const clicksPerLink = Object.entries(clickCounts).map(([link_id, count]) => ({
    link_id,
    count,
  }));

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentClicks = clicks.filter(
    (row) => new Date(row.clicked_at) >= thirtyDaysAgo
  );

  const clicksPerDay: Record<string, number> = {};
  recentClicks.forEach((row) => {
    const day = new Date(row.clicked_at).toISOString().split("T")[0];
    clicksPerDay[day] = (clicksPerDay[day] || 0) + 1;
  });

  const dailyClicks = Object.entries(clicksPerDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return {
    clicksPerLink,
    dailyClicks,
    totalClicks: clicks.length,
    weeklyClicks: recentClicks.filter(
      (row) => new Date(row.clicked_at) >= oneWeekAgo
    ).length,
  };
}
