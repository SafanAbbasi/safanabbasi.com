"use client";

import { useState, type ComponentProps } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import SortableLinkItem from "@/components/SortableLinkItem";
import type { LinkFormValues, LinkRow } from "@/lib/admin/types";

interface Props {
  links: LinkRow[];
  sensors: NonNullable<ComponentProps<typeof DndContext>["sensors"]>;
  getClickCount: (linkId: string) => number;
  onDragEnd: (event: DragEndEvent) => void | Promise<void>;
  onToggleActive: (id: string, isActive: boolean) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onEdit: (id: string, updates: Partial<LinkRow>) => void | Promise<void>;
  onAddLink: (values: LinkFormValues) => Promise<boolean>;
}

const initialForm: LinkFormValues = {
  label: "",
  url: "",
  bgColor: "#333333",
  hoverColor: "#555555",
  icon: "",
};

export default function LinksManagerSection({
  links,
  sensors,
  getClickCount,
  onDragEnd,
  onToggleActive,
  onDelete,
  onEdit,
  onAddLink,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const added = await onAddLink(form);
    if (!added) return;

    setForm(initialForm);
    setShowAddForm(false);
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Manage Links</h2>
          <p className="text-xs text-gray-400">Drag to reorder</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((current) => !current)}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Link
        </button>
      </div>

      {showAddForm && (
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Label (e.g. Twitter)"
                value={form.label}
                onChange={(e) => setForm((current) => ({ ...current, label: e.target.value }))}
                required
                className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
              <input
                type="url"
                placeholder="URL (e.g. https://twitter.com/...)"
                value={form.url}
                onChange={(e) => setForm((current) => ({ ...current, url: e.target.value }))}
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
                  value={form.bgColor}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, bgColor: e.target.value }))
                  }
                  className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 p-1"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Hover Color
                </label>
                <input
                  type="color"
                  value={form.hoverColor}
                  onChange={(e) =>
                    setForm((current) => ({ ...current, hoverColor: e.target.value }))
                  }
                  className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 p-1"
                />
              </div>
              <input
                type="text"
                placeholder="Icon name (optional)"
                value={form.icon}
                onChange={(e) => setForm((current) => ({ ...current, icon: e.target.value }))}
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
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={links.map((link) => link.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="divide-y divide-gray-50">
            {links.map((link) => (
              <SortableLinkItem
                key={link.id}
                link={link}
                clickCount={getClickCount(link.id)}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
