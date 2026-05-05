"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export type RegistryRecord = {
  id: string;
  name: string;
  category: string;
  status: "draft" | "active" | "review" | "paused" | "archived";
  owner: string;
  summary: string;
  publicHref?: string;
  adminHref?: string;
  metrics?: string[];
};

type AdminRegistryToolProps = {
  eyebrow: string;
  title: string;
  description: string;
  registryKey: string;
  records: RegistryRecord[];
  addLabel: string;
  publishLabel: string;
  externalHref?: string;
  externalLabel?: string;
};

export default function AdminRegistryTool({
  eyebrow,
  title,
  description,
  registryKey,
  records,
  addLabel,
  publishLabel,
  externalHref,
  externalLabel,
}: AdminRegistryToolProps) {
  const [items, setItems] = useState(records);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<RegistryRecord | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const searchable = `${item.name} ${item.category} ${item.owner} ${item.summary}`.toLowerCase();
        return (status === "all" || item.status === status) && searchable.includes(query.toLowerCase());
      }),
    [items, query, status],
  );

  async function persist(nextItems: RegistryRecord[], action: string, id?: string, actionNote?: string) {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/registry/${registryKey}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: nextItems, action, id, note: actionNote }),
      });
      const result = (await response.json()) as { success: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error ?? "Unable to save.");
      setItems(nextItems);
      toast.success("Saved for Supabase handoff.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save.");
    } finally {
      setSaving(false);
    }
  }

  function updateStatus(item: RegistryRecord, nextStatus: RegistryRecord["status"]) {
    const nextItems = items.map((record) => (record.id === item.id ? { ...record, status: nextStatus } : record));
    void persist(nextItems, nextStatus, item.id, note);
    setSelected(null);
    setNote("");
  }

  function addRecord() {
    const created: RegistryRecord = {
      id: `${registryKey}-${Date.now()}`,
      name: "New admin record",
      category: "Draft",
      status: "draft",
      owner: "Admin Ops",
      summary: "Draft record ready for details before publishing.",
      metrics: ["Needs content", "Not public"],
    };
    void persist([created, ...items], "create", created.id);
  }

  function exportPayload() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${registryKey}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Export prepared.");
  }

  return (
    <div className="space-y-8">
      <section className="panel-soft flex flex-wrap items-end justify-between gap-6 p-6 md:p-8">
        <div className="max-w-3xl">
          <span className="section-kicker">{eyebrow}</span>
          <h1 className="mt-5 text-5xl leading-none md:text-7xl">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-ink-soft">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {externalHref && externalLabel ? (
            <Link className="btn-pill btn-pill-outline" href={externalHref}>
              {externalLabel}
            </Link>
          ) : null}
          <button className="btn-pill btn-pill-outline" type="button" onClick={exportPayload}>
            Export JSON
          </button>
          <button className="btn-pill btn-pill-forest" type="button" onClick={addRecord} disabled={saving}>
            {saving ? "Saving..." : addLabel}
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="panel-soft p-5">
          <p className="metric-text text-3xl">{items.length}</p>
          <p className="mt-2 text-ink-soft">Records</p>
        </div>
        <div className="panel-soft p-5">
          <p className="metric-text text-3xl">{items.filter((item) => item.status === "active").length}</p>
          <p className="mt-2 text-ink-soft">Live</p>
        </div>
        <div className="panel-soft p-5">
          <p className="metric-text text-3xl">{items.filter((item) => item.status === "review").length}</p>
          <p className="mt-2 text-ink-soft">Review</p>
        </div>
        <div className="panel-soft p-5">
          <p className="metric-text text-3xl">{items.filter((item) => item.publicHref).length}</p>
          <p className="mt-2 text-ink-soft">Public Links</p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-[1fr_260px]">
        <input className="input-editorial min-h-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} />
        <select className="input-editorial min-h-11" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="review">Review</option>
          <option value="draft">Draft</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>
      </section>

      <section className="panel-soft overflow-hidden">
        <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[rgba(247,244,239,0.9)] text-left">
            <tr>
              <th className="p-4">Record</th>
              <th className="p-4">Category</th>
              <th className="p-4">Owner</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item) => (
              <tr className="border-t align-top" key={item.id}>
                <td className="p-4">
                  <strong>{item.name}</strong>
                  <p className="mt-1 max-w-xl text-ink-soft">{item.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.metrics?.map((metric) => (
                      <span className="badge-patch" key={metric}>
                        {metric}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">{item.category}</td>
                <td className="p-4">{item.owner}</td>
                <td className="p-4">
                  <span className="badge-patch">{item.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {item.publicHref ? (
                      <Link className="btn-pill btn-pill-outline" href={item.publicHref}>
                        Public
                      </Link>
                    ) : null}
                    {item.adminHref ? (
                      <Link className="btn-pill btn-pill-outline" href={item.adminHref}>
                        Linked
                      </Link>
                    ) : null}
                    <button className="btn-pill btn-pill-outline" type="button" onClick={() => setSelected(item)}>
                      Review
                    </button>
                    <button className="btn-pill btn-pill-forest" type="button" onClick={() => updateStatus(item, "active")} disabled={saving}>
                      {publishLabel}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.55)] p-4">
          <div className="modal-surface w-full max-w-2xl border border-[rgba(44,44,44,0.12)] p-6 md:p-8">
            <span className="section-kicker">Connected review</span>
            <h2 className="mt-4 text-3xl">{selected.name}</h2>
            <p className="mt-3 text-ink-soft">{selected.summary}</p>
            <textarea className="input-editorial mt-5 min-h-32" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Admin note, compliance decision, or publication change" />
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => setSelected(null)}>
                Close
              </button>
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => updateStatus(selected, "review")} disabled={saving}>
                Mark Review
              </button>
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => updateStatus(selected, "paused")} disabled={saving}>
                Pause
              </button>
              <button className="btn-pill btn-pill-forest" type="button" onClick={() => updateStatus(selected, "active")} disabled={saving}>
                {publishLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
