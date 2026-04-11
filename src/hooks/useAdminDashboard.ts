"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type {
  AnalyticsData,
  LinkFormValues,
  LinkRow,
  MessageRow,
  RedirectFormValues,
  RedirectRow,
} from "@/lib/admin/types";

type DashboardData = {
  analytics: AnalyticsData | null;
  links: LinkRow[];
  redirects: RedirectRow[];
  messages: MessageRow[];
};

async function loadDashboardData(
  supabase: ReturnType<typeof createBrowserSupabaseClient>
): Promise<DashboardData> {
  const [analyticsRes, linksRes, redirectsRes, messagesRes] = await Promise.all([
    fetch("/api/analytics", { cache: "no-store" }),
    supabase.from("links").select("*").order("sort_order"),
    supabase.from("redirects").select("*").order("created_at"),
    supabase.from("messages").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    analytics: analyticsRes.ok ? await analyticsRes.json() : null,
    links: linksRes.data ?? [],
    redirects: redirectsRes.data ?? [],
    messages: messagesRes.data ?? [],
  };
}

export function useAdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [redirects, setRedirects] = useState<RedirectRow[]>([]);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const showError = useCallback((message: string) => {
    setErrorMsg(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => setErrorMsg(null), 4000);
  }, []);

  const applyDashboardData = useCallback((data: DashboardData) => {
    setAnalytics(data.analytics);
    setLinks(data.links);
    setRedirects(data.redirects);
    setMessages(data.messages);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const data = await loadDashboardData(supabase);
      applyDashboardData(data);
    } catch {
      showError("Failed to refresh dashboard data");
    }
  }, [applyDashboardData, showError, supabase]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      try {
        const data = await loadDashboardData(supabase);
        if (cancelled) return;
        applyDashboardData(data);
      } catch {
        if (!cancelled) {
          showError("Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      cancelled = true;
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [applyDashboardData, showError, supabase]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }, [router, supabase]);

  const toggleLinkActive = useCallback(
    async (id: string, isActive: boolean) => {
      const { error } = await supabase
        .from("links")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) {
        showError("Failed to toggle link");
        return;
      }

      await refresh();
    },
    [refresh, showError, supabase]
  );

  const deleteLink = useCallback(
    async (id: string) => {
      if (!confirm("Delete this link?")) return;

      const { error } = await supabase.from("links").delete().eq("id", id);
      if (error) {
        showError("Failed to delete link");
        return;
      }

      await refresh();
    },
    [refresh, showError, supabase]
  );

  const editLink = useCallback(
    async (id: string, updates: Partial<LinkRow>) => {
      const { error } = await supabase.from("links").update(updates).eq("id", id);
      if (error) {
        showError("Failed to update link");
        return;
      }

      await refresh();
    },
    [refresh, showError, supabase]
  );

  const addLink = useCallback(
    async (values: LinkFormValues) => {
      const id = values.label.toLowerCase().replace(/\s+/g, "-");
      const maxOrder = links.reduce((max, link) => Math.max(max, link.sort_order), 0);

      const { error } = await supabase.from("links").insert({
        id,
        label: values.label,
        url: values.url,
        bg_color: values.bgColor,
        hover_color: values.hoverColor,
        icon: values.icon || null,
        sort_order: maxOrder + 1,
        is_active: true,
      });

      if (error) {
        showError("Failed to add link");
        return false;
      }

      await refresh();
      return true;
    },
    [links, refresh, showError, supabase]
  );

  const reorderLinks = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);
      const reordered = arrayMove(links, oldIndex, newIndex);

      setLinks(reordered);

      const updates = reordered.map((link, index) =>
        supabase
          .from("links")
          .update({ sort_order: index + 1 })
          .eq("id", link.id)
      );

      const results = await Promise.all(updates);
      if (results.some((result) => result.error)) {
        showError("Failed to reorder links");
        await refresh();
      }
    },
    [links, refresh, showError, supabase]
  );

  const addRedirect = useCallback(
    async (values: RedirectFormValues) => {
      const cleanSlug = values.slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
      const { error } = await supabase.from("redirects").insert({
        slug: cleanSlug,
        destination_url: values.destination,
      });

      if (error) {
        showError("Failed to add shortlink");
        return false;
      }

      await refresh();
      return true;
    },
    [refresh, showError, supabase]
  );

  const deleteRedirect = useCallback(
    async (slug: string) => {
      if (!confirm(`Delete shortlink /${slug}?`)) return;

      const { error } = await supabase.from("redirects").delete().eq("slug", slug);
      if (error) {
        showError("Failed to delete shortlink");
        return;
      }

      await refresh();
    },
    [refresh, showError, supabase]
  );

  const deleteMessage = useCallback(
    async (id: number) => {
      if (!confirm("Delete this message?")) return;

      const { error } = await supabase.from("messages").delete().eq("id", id);
      if (error) {
        showError("Failed to delete message");
        return;
      }

      await refresh();
    },
    [refresh, showError, supabase]
  );

  const replyToMessage = useCallback(
    async (id: number, reply: string) => {
      const response = await fetch(`/api/messages/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reply");
      }

      await refresh();
    },
    [refresh]
  );

  const getClickCount = useCallback(
    (linkId: string) =>
      analytics?.clicksPerLink.find((click) => click.link_id === linkId)?.count || 0,
    [analytics]
  );

  const getRedirectClickCount = useCallback(
    (slug: string) =>
      analytics?.clicksPerLink.find((click) => click.link_id === `redirect:${slug}`)
        ?.count || 0,
    [analytics]
  );

  const topLinkLabel = useMemo(() => {
    const topLink = analytics?.clicksPerLink.reduce(
      (top, item) => (item.count > (top?.count || 0) ? item : top),
      null as { link_id: string; count: number } | null
    );

    return links.find((link) => link.id === topLink?.link_id)?.label || topLink?.link_id || "—";
  }, [analytics, links]);

  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : "https://www.safanabbasi.com";

  return {
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
  };
}
