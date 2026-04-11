import ClickChart from "@/components/ClickChart";
import LinkStats from "@/components/LinkStats";
import QRCode from "@/components/QRCode";
import type { AnalyticsData, LinkRow } from "@/lib/admin/types";

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
