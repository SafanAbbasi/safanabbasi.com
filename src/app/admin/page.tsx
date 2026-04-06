"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import ClickChart from "@/components/ClickChart";
import LinkStats from "@/components/LinkStats";
import SortableLinkItem from "@/components/SortableLinkItem";
import QRCode from "@/components/QRCode";
import {
  MousePointerClick,
  CalendarDays,
  TrendingUp,
  LogOut,
  Plus,
  ExternalLink,
  LayoutDashboard,
  Download,
  Trash2,
  MessageSquare,
  Reply,
  Send,
  Check,
} from "lucide-react";

interface AnalyticsData {
  clicksPerLink: { link_id: string; count: number }[];
  dailyClicks: { date: string; count: number }[];
  totalClicks: number;
  weeklyClicks: number;
}

interface LinkRow {
  id: string;
  label: string;
  url: string;
  bg_color: string;
  hover_color: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

interface RedirectRow {
  slug: string;
  destination_url: string;
  created_at: string;
}

interface MessageRow {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  replied_at: string | null;
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [redirects, setRedirects] = useState<RedirectRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddRedirect, setShowAddRedirect] = useState(false);
  const router = useRouter();

  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newBgColor, setNewBgColor] = useState("#333333");
  const [newHoverColor, setNewHoverColor] = useState("#555555");
  const [newIcon, setNewIcon] = useState("");

  const [newSlug, setNewSlug] = useState("");
  const [newDestination, setNewDestination] = useState("");

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createBrowserSupabaseClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchData = useCallback(async () => {
    const [analyticsRes, linksRes, redirectsRes, messagesRes] = await Promise.all([
      fetch("/api/analytics"),
      supabase.from("links").select("*").order("sort_order"),
      supabase.from("redirects").select("*").order("created_at"),
      supabase.from("messages").select("*").order("created_at", { ascending: false }),
    ]);

    if (analyticsRes.ok) {
      setAnalytics(await analyticsRes.json());
    }
    if (linksRes.data) {
      setLinks(linksRes.data);
    }
    if (redirectsRes.data) {
      setRedirects(redirectsRes.data);
    }
    if (messagesRes.data) {
      setMessages(messagesRes.data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 4000);
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from("links").update({ is_active: !isActive }).eq("id", id);
    if (error) return showError("Failed to toggle link");
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this link?")) return;
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (error) return showError("Failed to delete link");
    fetchData();
  };

  const handleEdit = async (id: string, updates: Partial<LinkRow>) => {
    const { error } = await supabase.from("links").update(updates).eq("id", id);
    if (error) return showError("Failed to update link");
    fetchData();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);

    setLinks(reordered);

    const updates = reordered.map((link, i) =>
      supabase
        .from("links")
        .update({ sort_order: i + 1 })
        .eq("id", link.id)
    );
    await Promise.all(updates);
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = newLabel.toLowerCase().replace(/\s+/g, "-");
    const maxOrder = links.reduce((max, l) => Math.max(max, l.sort_order), 0);

    const { error } = await supabase.from("links").insert({
      id,
      label: newLabel,
      url: newUrl,
      bg_color: newBgColor,
      hover_color: newHoverColor,
      icon: newIcon || null,
      sort_order: maxOrder + 1,
      is_active: true,
    });
    if (error) return showError("Failed to add link");

    setNewLabel("");
    setNewUrl("");
    setNewBgColor("#333333");
    setNewHoverColor("#555555");
    setNewIcon("");
    setShowAddForm(false);
    fetchData();
  };

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const { error } = await supabase.from("redirects").insert({
      slug: cleanSlug,
      destination_url: newDestination,
    });
    if (error) return showError("Failed to add shortlink");
    setNewSlug("");
    setNewDestination("");
    setShowAddRedirect(false);
    fetchData();
  };

  const handleDeleteRedirect = async (slug: string) => {
    if (!confirm(`Delete shortlink /${slug}?`)) return;
    const { error } = await supabase.from("redirects").delete().eq("slug", slug);
    if (error) return showError("Failed to delete shortlink");
    fetchData();
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) return showError("Failed to delete message");
    fetchData();
  };

  const handleReply = async (id: number) => {
    if (!replyText.trim()) return;
    setReplyStatus("sending");
    try {
      const res = await fetch(`/api/messages/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText }),
      });
      if (res.ok) {
        setReplyStatus("sent");
        setReplyText("");
        setTimeout(() => {
          setReplyingTo(null);
          setReplyStatus("idle");
        }, 1500);
        fetchData();
      } else {
        setReplyStatus("error");
      }
    } catch {
      setReplyStatus("error");
    }
  };

  const getClickCount = (linkId: string) =>
    analytics?.clicksPerLink?.find((c) => c.link_id === linkId)?.count || 0;

  const getRedirectClickCount = (slug: string) =>
    analytics?.clicksPerLink?.find((c) => c.link_id === `redirect:${slug}`)?.count || 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-violet-600" />
            <p className="text-sm text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  const topLink = analytics?.clicksPerLink?.reduce(
    (top, item) => (item.count > (top?.count || 0) ? item : top),
    null as { link_id: string; count: number } | null
  );

  const topLinkLabel =
    links.find((l) => l.id === topLink?.link_id)?.label ||
    topLink?.link_id ||
    "—";

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://www.safanabbasi.com";

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                LinkPage Admin
              </h1>
              <p className="text-xs text-gray-500">Analytics & Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/analytics/export"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </a>
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Error banner */}
        {errorMsg && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}
        {/* Summary Cards */}
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

        {/* Charts + QR Code */}
        {analytics && (
          <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <LinkStats clicksPerLink={analytics.clicksPerLink} links={links} />
            <ClickChart dailyClicks={analytics.dailyClicks} />
            <QRCode url={siteUrl} />
          </div>
        )}

        {/* Links Management */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Manage Links
              </h2>
              <p className="text-xs text-gray-400">Drag to reorder</p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Link
            </button>
          </div>

          {showAddForm && (
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
              <form onSubmit={handleAddLink} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Label (e.g. Twitter)"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    required
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                  <input
                    type="url"
                    placeholder="URL (e.g. https://twitter.com/...)"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    required
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Button Color
                    </label>
                    <input
                      type="color"
                      value={newBgColor}
                      onChange={(e) => setNewBgColor(e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 p-1"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Hover Color
                    </label>
                    <input
                      type="color"
                      value={newHoverColor}
                      onChange={(e) => setNewHoverColor(e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 p-1"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Icon name (optional)"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={links.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="divide-y divide-gray-50">
                {links.map((link) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    clickCount={getClickCount(link.id)}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Short Links */}
        <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Short Links
              </h2>
              <p className="text-xs text-gray-400">
                safanabbasi.com/slug redirects and tracks clicks
              </p>
            </div>
            <button
              onClick={() => setShowAddRedirect(!showAddRedirect)}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Shortlink
            </button>
          </div>

          {showAddRedirect && (
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
              <form onSubmit={handleAddRedirect} className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Slug
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-400">safanabbasi.com/</span>
                    <input
                      type="text"
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value)}
                      placeholder="github"
                      required
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="https://github.com/..."
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                >
                  Save
                </button>
              </form>
            </div>
          )}

          <div className="divide-y divide-gray-50">
            {redirects.map((r) => (
              <div
                key={r.slug}
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50/50"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    /{r.slug}
                  </p>
                  <p className="text-sm text-gray-400">{r.destination_url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-gray-400" title="Total clicks">
                    <MousePointerClick className="h-3 w-3" />
                    {getRedirectClickCount(r.slug)}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${siteUrl}/${r.slug}`);
                    }}
                    className="rounded-lg px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => handleDeleteRedirect(r.slug)}
                    className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Messages */}
        <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Messages
                </h2>
                <p className="text-xs text-gray-400">
                  {messages.length} message{messages.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              No messages yet
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="px-6 py-4 transition-colors hover:bg-gray-50/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{msg.name}</p>
                        <a
                          href={`mailto:${msg.email}`}
                          className="truncate text-sm text-violet-600 hover:underline"
                        >
                          {msg.email}
                        </a>
                        {msg.replied_at && (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                            <Check className="h-3 w-3" />
                            Replied
                          </span>
                        )}
                      </div>
                      <p className="mt-1 max-h-32 overflow-y-auto text-sm whitespace-pre-wrap text-gray-600">
                        {msg.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {msg.replied_at && (
                          <> &middot; Replied {new Date(msg.replied_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}</>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        onClick={() => {
                          setReplyingTo(replyingTo === msg.id ? null : msg.id);
                          setReplyText("");
                          setReplyStatus("idle");
                        }}
                        className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-violet-50 hover:text-violet-500"
                        title="Reply"
                      >
                        <Reply className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline reply form */}
                  {replyingTo === msg.id && (
                    <div className="mt-3 rounded-xl border border-violet-100 bg-violet-50/50 p-4">
                      <p className="mb-2 text-xs font-medium text-violet-600">
                        Replying to {msg.name} &lt;{msg.email}&gt;
                      </p>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        rows={3}
                        className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
                        disabled={replyStatus === "sending" || replyStatus === "sent"}
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          From: contact@safanabbasi.com
                        </p>
                        <div className="flex items-center gap-2">
                          {replyStatus === "error" && (
                            <p className="text-xs text-red-500">Failed to send. Try again.</p>
                          )}
                          {replyStatus === "sent" && (
                            <p className="flex items-center gap-1 text-xs text-emerald-600">
                              <Check className="h-3 w-3" /> Sent!
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                              setReplyStatus("idle");
                            }}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100"
                            disabled={replyStatus === "sending"}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReply(msg.id)}
                            disabled={!replyText.trim() || replyStatus === "sending" || replyStatus === "sent"}
                            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            <Send className="h-3 w-3" />
                            {replyStatus === "sending" ? "Sending..." : "Send Reply"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
