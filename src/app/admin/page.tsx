"use client";

import AdminAnalyticsPanel from "@/components/admin/AdminAnalyticsPanel";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminLoadingState from "@/components/admin/AdminLoadingState";
import AdminSummaryCards from "@/components/admin/AdminSummaryCards";
import LinksManagerSection from "@/components/admin/LinksManagerSection";
import MessagesSection from "@/components/admin/MessagesSection";
import ShortLinksSection from "@/components/admin/ShortLinksSection";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

export default function AdminPage() {
  const {
    analytics,
    links,
    redirects,
    messages,
    loading,
    errorMsg,
    sensors,
    siteUrl,
    topLinkLabel,
    logout,
    addLink,
    editLink,
    toggleLinkActive,
    deleteLink,
    reorderLinks,
    addRedirect,
    deleteRedirect,
    deleteMessage,
    replyToMessage,
    getClickCount,
    getRedirectClickCount,
  } = useAdminDashboard();

  if (loading) {
    return <AdminLoadingState />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminHeader
        onExport={() => {
          window.location.href = "/api/analytics/export";
        }}
        onLogout={logout}
      />

      <div className="mx-auto max-w-5xl px-6 py-8">
        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}
        <AdminSummaryCards analytics={analytics} topLinkLabel={topLinkLabel} />
        <AdminAnalyticsPanel analytics={analytics} links={links} siteUrl={siteUrl} />
        <LinksManagerSection
          links={links}
          sensors={sensors}
          getClickCount={getClickCount}
          onDragEnd={reorderLinks}
          onToggleActive={toggleLinkActive}
          onDelete={deleteLink}
          onEdit={editLink}
          onAddLink={addLink}
        />
        <ShortLinksSection
          redirects={redirects}
          siteUrl={siteUrl}
          getRedirectClickCount={getRedirectClickCount}
          onAddRedirect={addRedirect}
          onDeleteRedirect={deleteRedirect}
        />
        <MessagesSection
          messages={messages}
          onDeleteMessage={deleteMessage}
          onReplyToMessage={replyToMessage}
        />
      </div>
    </main>
  );
}
