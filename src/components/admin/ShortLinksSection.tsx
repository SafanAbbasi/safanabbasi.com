"use client";

import { useState } from "react";
import { MousePointerClick, Plus, Trash2 } from "lucide-react";
import type { RedirectFormValues, RedirectRow } from "@/lib/admin/types";

interface Props {
  redirects: RedirectRow[];
  siteUrl: string;
  getRedirectClickCount: (slug: string) => number;
  onAddRedirect: (values: RedirectFormValues) => Promise<boolean>;
  onDeleteRedirect: (slug: string) => void | Promise<void>;
}

const initialForm: RedirectFormValues = {
  slug: "",
  destination: "",
};

export default function ShortLinksSection({
  redirects,
  siteUrl,
  getRedirectClickCount,
  onAddRedirect,
  onDeleteRedirect,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const added = await onAddRedirect(form);
    if (!added) return;

    setForm(initialForm);
    setShowAddForm(false);
  };

  return (
    <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Short Links</h2>
          <p className="text-xs text-gray-400">
            safanabbasi.com/slug redirects and tracks clicks
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((current) => !current)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Shortlink
        </button>
      </div>

      {showAddForm && (
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">Slug</label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400">safanabbasi.com/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))}
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
                value={form.destination}
                onChange={(e) =>
                  setForm((current) => ({ ...current, destination: e.target.value }))
                }
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
        {redirects.map((redirect) => (
          <div
            key={redirect.slug}
            className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-gray-50/50"
          >
            <div>
              <p className="font-medium text-gray-900">/{redirect.slug}</p>
              <p className="text-sm text-gray-400">{redirect.destination_url}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="flex items-center gap-1 text-xs text-gray-400"
                title="Total clicks"
              >
                <MousePointerClick className="h-3 w-3" />
                {getRedirectClickCount(redirect.slug)}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${siteUrl}/${redirect.slug}`);
                }}
                className="rounded-lg px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={() => onDeleteRedirect(redirect.slug)}
                className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
