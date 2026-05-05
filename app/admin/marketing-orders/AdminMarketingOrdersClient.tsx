"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { MarketingServiceOrder, Supplier } from "@/types/database";

type SlaFilter = MarketingServiceOrder["sla_status"] | "all";

const teamOptions = ["Brand Studio", "Growth Team", "Video Unit", "Account Management"];

function formatMoney(value: number) {
  return new Intl.NumberFormat("en", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function slaClass(status: MarketingServiceOrder["sla_status"]) {
  if (status === "breached") return "stamp-reject";
  if (status === "at_risk") return "stamp-pending";
  return "stamp-approve";
}

function tierDuration(tier: MarketingServiceOrder["tier"]) {
  if (tier === "premium") return "10 weeks";
  if (tier === "growth") return "6 weeks";
  return "3 weeks";
}

export default function AdminMarketingOrdersClient({ orders, suppliers }: { orders: MarketingServiceOrder[]; suppliers: Supplier[] }) {
  const [items, setItems] = useState(orders);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SlaFilter>("all");
  const [editingId, setEditingId] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingId, setLoadingId] = useState("");
  const [stampId, setStampId] = useState("");

  const supplierById = useMemo(() => new Map(suppliers.map((supplier) => [supplier.id, supplier])), [suppliers]);
  const filtered = useMemo(() => items.filter((item) => {
    const supplier = supplierById.get(item.supplier_id);
    const haystack = `${item.id} ${item.tier} ${item.status} ${supplier?.company_name ?? ""} ${supplier?.slug ?? ""}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (filter === "all" || item.sla_status === filter);
  }), [filter, items, query, supplierById]);

  const breachedCount = items.filter((item) => item.sla_status === "breached").length;
  const atRiskCount = items.filter((item) => item.sla_status === "at_risk").length;
  const bookedRevenue = items.reduce((total, item) => total + item.price_usd, 0);

  async function patchOrder(id: string, update: Partial<MarketingServiceOrder>, success: string) {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/admin/marketing-orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Update failed");
      setItems((list) => list.map((item) => item.id === id ? { ...item, ...update } : item));
      setStampId(id);
      toast.success(success);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setLoadingId("");
    }
  }

  function openNotes(order: MarketingServiceOrder) {
    setEditingId(order.id);
    setNotes(order.delay_notes ?? "");
  }

  async function saveNotes(order: MarketingServiceOrder) {
    if (!notes.trim()) {
      toast.error("Delay note is required");
      return;
    }
    await patchOrder(order.id, { delay_notes: notes, sla_status: order.sla_status === "on_track" ? "at_risk" : order.sla_status }, "Delay note saved");
    setEditingId("");
    setNotes("");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">SLA Monitor</span>
          <h1 className="mt-4 text-4xl">Marketing Orders</h1>
          <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">Track Basic, Growth, and Premium service delivery. Breached orders are flagged for admin follow-up, assignment, and delay notes.</p>
        </div>
        <div className="grid gap-3 text-right sm:grid-cols-3">
          <div><p className="metric-numeral text-3xl">{formatMoney(bookedRevenue)}</p><p className="small-caps text-sm">Booked</p></div>
          <div><p className="metric-numeral text-3xl">{atRiskCount}</p><p className="small-caps text-sm">At risk</p></div>
          <div><p className="metric-numeral text-3xl text-[var(--terracotta)]">{breachedCount}</p><p className="small-caps text-sm">Breached</p></div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <input className="input-editorial" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order, supplier, tier, status" />
        <select className="input-editorial" value={filter} onChange={(event) => setFilter(event.target.value as SlaFilter)}>
          <option value="all">All SLA statuses</option>
          <option value="on_track">On Track</option>
          <option value="at_risk">At Risk</option>
          <option value="breached">Breached Only</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="mt-8 overflow-x-auto border">
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead className="border-b bg-[var(--cream)] text-left">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Supplier</th>
              <th className="p-4">Package</th>
              <th className="p-4">Payment</th>
              <th className="p-4">SLA Due</th>
              <th className="p-4">SLA</th>
              <th className="p-4">Assigned</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const supplier = supplierById.get(order.supplier_id);
              return (
                <tr className="border-b align-top" key={order.id}>
                  <td className="p-4">
                    <p className="font-semibold">{order.id}</p>
                    <span className="badge-patch mt-2">{order.status}</span>
                    {stampId === order.id && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Updated</p>}
                  </td>
                  <td className="p-4">
                    {supplier ? <Link className="font-semibold underline-offset-4 hover:underline" href={`/suppliers/${supplier.slug}`}>{supplier.company_name}</Link> : order.supplier_id}
                    <p className="mt-1 text-xs text-[var(--ink-muted)]">{supplier?.city ?? "Unknown cluster"}</p>
                  </td>
                  <td className="p-4">
                    <p className="capitalize">{order.tier}</p>
                    <p className="metric-numeral mt-1">{formatMoney(order.price_usd)}</p>
                    <p className="text-xs text-[var(--ink-muted)]">Delivery {tierDuration(order.tier)}</p>
                  </td>
                  <td className="p-4">
                    <p>{order.payment_method.replace("_", " ")}</p>
                    <p className="text-xs text-[var(--ink-muted)]">{order.local_payment_reference ?? "Stripe / card reference"}</p>
                    <p className="text-xs text-[var(--ink-muted)]">Paid {formatDate(order.paid_at)}</p>
                  </td>
                  <td className="p-4">
                    <p>{formatDate(order.sla_due_at)}</p>
                    <p className="text-xs text-[var(--ink-muted)]">Started {formatDate(order.starts_at)}</p>
                  </td>
                  <td className="p-4">
                    <span className={`badge-patch ${slaClass(order.sla_status)}`}>{order.sla_status.replace("_", " ")}</span>
                    {order.delay_notes && <p className="mt-2 border border-[var(--terracotta)] p-2 text-xs text-[var(--terracotta)]">{order.delay_notes}</p>}
                  </td>
                  <td className="p-4">
                    <select className="input-editorial min-w-[170px]" value={order.assigned_to ?? ""} onChange={(event) => patchOrder(order.id, { assigned_to: event.target.value || null }, "Assigned team updated")} disabled={loadingId === order.id}>
                      <option value="">Unassigned</option>
                      {teamOptions.map((team) => <option key={team} value={team}>{team}</option>)}
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap justify-end gap-2">
                      <button className="btn-pill btn-pill-outline min-h-[44px] px-5" onClick={() => openNotes(order)}>Delay Note</button>
                      <button className="btn-pill btn-pill-forest min-h-[44px] px-5 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => patchOrder(order.id, { status: "delivered", sla_status: "delivered" }, "Marked delivered")} disabled={order.sla_status === "delivered" || loadingId === order.id}>Mark Delivered</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && <div className="mt-6 border p-6 text-center">No marketing orders match this filter.</div>}

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.45)] p-4">
          <div className="modal-surface w-full max-w-xl">
            <span className="badge-patch stamp-pending">Delay Reason</span>
            <h2 className="mt-4 text-3xl">Add SLA Note</h2>
            <p className="mt-2 text-[var(--ink-soft)]">The original prompt requires notes on delay reason and one-click operational follow-up for breached service orders.</p>
            <textarea className="input-editorial mt-4 min-h-[130px]" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Explain delay reason and next action" />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setEditingId("")}>Cancel</button>
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => {
                const order = items.find((item) => item.id === editingId);
                if (order) void saveNotes(order);
              }} disabled={loadingId === editingId}>{loadingId === editingId ? "Saving..." : "Save Note"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
