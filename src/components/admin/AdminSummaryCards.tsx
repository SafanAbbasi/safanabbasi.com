import { CalendarDays, MousePointerClick, TrendingUp } from "lucide-react";
import type { AnalyticsData } from "@/lib/admin/types";

export default function AdminSummaryCards({
  analytics,
  topLinkLabel,
}: {
  analytics: AnalyticsData | null;
  topLinkLabel: string;
}) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
        <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-violet-50 transition-transform group-hover:scale-110" />
        <div className="relative">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
            <MousePointerClick className="h-5 w-5 text-violet-600" />
          </div>
          <p className="text-sm font-medium text-gray-500">Total Clicks</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            {analytics?.totalClicks || 0}
          </p>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
        <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-blue-50 transition-transform group-hover:scale-110" />
        <div className="relative">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <CalendarDays className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-500">This Week</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            {analytics?.weeklyClicks || 0}
          </p>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
        <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-emerald-50 transition-transform group-hover:scale-110" />
        <div className="relative">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-gray-500">Most Popular</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            {topLinkLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
