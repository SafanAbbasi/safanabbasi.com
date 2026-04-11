import { NextResponse } from "next/server";
import { createAuthSupabaseClient } from "@/lib/supabase/server";

type ClickRow = {
  link_id: string;
  clicked_at: string;
};

type SummaryRow = {
  total_clicks: number | string;
  weekly_clicks: number | string;
};

type ClickCountRow = {
  link_id: string;
  count: number | string;
};

type DailyClickRow = {
  date: string;
  count: number | string;
};

function normalizeCount(value: number | string | null | undefined) {
  return typeof value === "number" ? value : Number(value || 0);
}

async function getAnalyticsViaRpc(
  supabase: Awaited<ReturnType<typeof createAuthSupabaseClient>>
) {
  const [summaryRes, clicksPerLinkRes, dailyClicksRes] = await Promise.all([
    supabase.rpc("get_click_summary"),
    supabase.rpc("get_clicks_per_link"),
    supabase.rpc("get_daily_clicks", { window_days: 30 }),
  ]);

  if (summaryRes.error || clicksPerLinkRes.error || dailyClicksRes.error) {
    throw new Error("Analytics RPCs unavailable");
  }

  const summary = summaryRes.data?.[0] as SummaryRow | undefined;
  const clicksPerLinkRows = (clicksPerLinkRes.data || []) as ClickCountRow[];
  const dailyClickRows = (dailyClicksRes.data || []) as DailyClickRow[];

  return {
    clicksPerLink: clicksPerLinkRows.map((row) => ({
      link_id: row.link_id,
      count: normalizeCount(row.count),
    })),
    dailyClicks: dailyClickRows.map((row) => ({
      date: row.date,
      count: normalizeCount(row.count),
    })),
    totalClicks: normalizeCount(summary?.total_clicks),
    weeklyClicks: normalizeCount(summary?.weekly_clicks),
  };
}

async function getAnalyticsViaFallback(
  supabase: Awaited<ReturnType<typeof createAuthSupabaseClient>>
) {
  const { data: allClicks } = await supabase
    .from("clicks")
    .select("link_id, clicked_at");

  const clicks = (allClicks || []) as ClickRow[];

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

export async function GET() {
  const supabase = await createAuthSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const analytics = await getAnalyticsViaRpc(supabase);
    return NextResponse.json(analytics);
  } catch {
    const analytics = await getAnalyticsViaFallback(supabase);
    return NextResponse.json(analytics);
  }
}
