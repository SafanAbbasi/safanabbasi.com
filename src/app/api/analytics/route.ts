import { NextResponse } from "next/server";
import { aggregateAnalyticsFromClicks } from "@/lib/analytics-aggregate";
import type { ClickRow } from "@/lib/analytics-aggregate";
import { createAuthSupabaseClient } from "@/lib/supabase/server";

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
  return aggregateAnalyticsFromClicks(clicks);
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
