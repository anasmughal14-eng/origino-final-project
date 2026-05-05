"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

export type AdminQueueRecord = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  priority?: string;
  href?: string;
};

type AdminQueuePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  records: AdminQueueRecord[];
  primaryActionLabel?: string;
  primaryActionHref?: string;
};

export default function AdminQueuePage({
  eyebrow,
  title,
  description,
  records,
  primaryActionLabel,
  primaryActionHref,
}: AdminQueuePageProps) {
  const [items, setItems] = useState(records);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const statuses = useMemo(() => ["all", ...Array.from(new Set(items.map((item) => item.status)))], [items]);
  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesStatus = status === "all" || item.status === status;
        const content = `${item.title} ${item.subtitle} ${item.id}`.toLowerCase();
        return matchesStatus && content.includes(query.toLowerCase());
      }),
    [items, query, status],
  );
  const activeItem = items.find((item) => item.id === activeId);

  function updateItem(id: string, nextStatus: string, message: string) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
    setActiveId(null);
    setNote("");
    toast.success(message);
  }

  function saveNote() {
    if (!activeItem || !note.trim()) {
      toast.error("Add an admin note first.");
      return;
    }
    updateItem(activeItem.id, "noted", "Admin note saved.");
  }

  return (
    <div className="space-y-8">
      <section className="panel-soft flex flex-wrap items-end justify-between gap-6 p-6 md:p-8">
        <div className="max-w-3xl">
          <span className="section-kicker">{eyebrow}</span>
          <h1 className="mt-5 text-5xl leading-none md:text-7xl">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-ink-soft">{description}</p>
        </div>
        {primaryActionHref && primaryActionLabel ? (
          <Link className="btn-pill btn-pill-forest" href={primaryActionHref}>
            {primaryActionLabel}
          </Link>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel-soft p-5">
          <p className="metric-text text-3xl">{items.length}</p>
          <p className="mt-2 text-ink-soft">Records</p>
        </div>
        <div className="panel-soft p-5">
          <p className="metric-text text-3xl">{items.filter((item) => item.status === "active" || item.status === "open").length}</p>
          <p className="mt-2 text-ink-soft">Open</p>
        </div>
        <div className="panel-soft p-5">
          <p className="metric-text text-3xl">{items.filter((item) => item.priority === "urgent").length}</p>
          <p className="mt-2 text-ink-soft">Urgent</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <input
          className="input-editorial min-h-11 flex-1"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${title.toLowerCase()}`}
        />
        <select className="input-editorial min-h-11 max-w-xs" value={status} onChange={(event) => setStatus(event.target.value)}>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All statuses" : item}
            </option>
          ))}
        </select>
      </section>

      <section className="panel-soft overflow-hidden">
        <div className="grid gap-3 border-b bg-cream p-4 font-semibold lg:grid-cols-[1fr_auto_auto]">
          <span>Record</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="divide-y">
          {visibleItems.map((item) => (
            <div className="grid gap-3 p-4 lg:grid-cols-[1fr_auto_auto]" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p className="mt-1 text-ink-soft">{item.subtitle}</p>
                <p className="mt-1 text-sm text-ink-muted">{item.id}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="badge-patch">{item.status}</span>
                {item.priority ? <span className="badge-patch">{item.priority}</span> : null}
              </div>
              <div className="flex flex-wrap gap-3">
                {item.href ? (
                  <Link className="btn-pill btn-pill-outline" href={item.href}>
                    Open
                  </Link>
                ) : null}
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => setActiveId(item.id)}>
                  Review
                </button>
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => updateItem(item.id, "flagged", "Record flagged.")}>
                  Flag
                </button>
                <button className="btn-pill btn-pill-forest" type="button" onClick={() => updateItem(item.id, "completed", "Record completed.")}>
                  Complete
                </button>
              </div>
            </div>
          ))}
          {visibleItems.length === 0 ? <div className="p-8 text-center text-ink-muted">No records match this filter.</div> : null}
        </div>
      </section>

      {activeItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.55)] p-4">
          <div className="modal-surface w-full max-w-2xl">
            <span className="section-kicker">Record review</span>
            <h2 className="mt-4 text-3xl">{activeItem.title}</h2>
            <p className="mt-3 text-ink-soft">{activeItem.subtitle}</p>
            <textarea
              className="input-editorial mt-5 min-h-32"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Admin note, decision, or follow-up"
            />
            <div className="mt-5 flex flex-wrap justify-end gap-3">
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => setActiveId(null)}>
                Close
              </button>
              <button className="btn-pill btn-pill-outline" type="button" onClick={saveNote}>
                Save Note
              </button>
              <button className="btn-pill btn-pill-forest" type="button" onClick={() => updateItem(activeItem.id, "completed", "Record completed.")}>
                Complete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
