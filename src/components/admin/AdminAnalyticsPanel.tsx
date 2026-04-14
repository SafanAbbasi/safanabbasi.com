"use client";

import dynamic from "next/dynamic";
import LinkStats from "@/components/LinkStats";
import QRCode from "@/components/QRCode";
import type { AnalyticsData, LinkRow } from "@/lib/admin/types";

const ClickChart = dynamic(() => import("@/components/ClickChart"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-1 h-4 w-32 animate-pulse rounded bg-gray-100" />
      <div className="mb-5 h-3 w-20 animate-pulse rounded bg-gray-100" />
      <div className="h-[200px] animate-pulse rounded-lg bg-gray-50" />
    </div>
  ),
});

export default function AdminAnalyticsPanel({
  analytics,
  links,
  siteUrl,
}: {
  analytics: AnalyticsData | null;
  links: LinkRow[];
  siteUrl: string;
}) {
  if (!analytics) return null;

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <LinkStats clicksPerLink={analytics.clicksPerLink} links={links} />
      <ClickChart dailyClicks={analytics.dailyClicks} />
      <QRCode url={siteUrl} />
    </div>
  );
}
