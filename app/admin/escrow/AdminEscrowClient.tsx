"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { applyEscrowOverrides, applyOrderOverrides, saveEscrowOverride, saveOrderOverride } from "@/app/components/shared/sellerMockStore";
import type { EscrowTransaction, Order } from "@/types/database";

type EscrowStatus = EscrowTransaction["status"];

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

function formatDate(value: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function statusClass(status: EscrowStatus) {
  if (status === "released") return "stamp-approve";
  if (status === "disputed" || status === "refunded") return "stamp-reject";
  return "stamp-pending";
}

export default function AdminEscrowClient({ transactions, orders }: { transactions: EscrowTransaction[]; orders: Order[] }) {
  const [items, setItems] = useState(transactions);
  const [orderItems, setOrderItems] = useState(orders);
  const [releaseId, setReleaseId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [disputeId, setDisputeId] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingId, setLoadingId] = useState("");
  const [filter, setFilter] = useState<EscrowStatus | "all">("all");
  const [stampId, setStampId] = useState("");

  useEffect(() => {
    let active = true;
    async function hydrateEscrow() {
      let source = transactions;
      try {
        const response = await fetch("/api/escrow");
        const payload = await response.json() as { success: boolean; data?: { transactions?: EscrowTransaction[] } };
        if (payload.success && Array.isArray(payload.data?.transactions)) source = payload.data.transactions;
      } catch {
        source = transactions;
      }
      if (active) setItems(applyEscrowOverrides(source));
    }
    void hydrateEscrow();
    return () => {
      active = false;
    };
  }, [transactions]);

  useEffect(() => {
    function syncOrders() {
      setOrderItems(applyOrderOverrides(orders));
    }
    syncOrders();
    window.addEventListener("storage", syncOrders);
    window.addEventListener("origino:seller-mock-store", syncOrders);
    window.addEventListener("origino:trade-store", syncOrders);
    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("origino:seller-mock-store", syncOrders);
      window.removeEventListener("origino:trade-store", syncOrders);
    };
  }, [orders]);

  const orderById = useMemo(() => new Map(orderItems.map((order) => [order.id, order])), [orderItems]);
  const visibleItems = useMemo(() => items.filter((item) => filter === "all" || item.status === filter), [items, filter]);
  const totalHeld = items.filter((item) => item.status === "funded" || item.status === "disputed").reduce((total, item) => total + item.amount_usd, 0);

  async function releaseFunds(transaction: EscrowTransaction) {
    if (!confirmed) {
      toast.error("Confirm the irreversible release first");
      return;
    }
    setLoadingId(`release-${transaction.id}`);
    try {
      const response = await fetch("/api/escrow/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ escrowId: transaction.id, orderId: transaction.order_id, adminId: "mock-admin" }),
      });
      const payload = await response.json() as { success: boolean; error?: string; data?: { releasedAt?: string } };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Release failed");
      const releasedAt = payload.data?.releasedAt ?? new Date().toISOString();
      setItems((list) => list.map((item) => item.id === transaction.id ? { ...item, status: "released", released_at: releasedAt, dispute_reason: null } : item));
      saveEscrowOverride(transaction.id, { status: "released", released_at: releasedAt, dispute_reason: null });
      saveOrderOverride(transaction.order_id, { escrow_status: "released", updated_at: releasedAt });
      setReleaseId("");
      setConfirmed(false);
      setStampId(transaction.id);
      toast.success("Escrow released");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Release failed");
    } finally {
      setLoadingId("");
    }
  }

  async function openDispute(transaction: EscrowTransaction) {
    if (!notes.trim()) {
      toast.error("Dispute notes are required");
      return;
    }
    setLoadingId(`dispute-${transaction.id}`);
    try {
      const response = await fetch("/api/escrow/dispute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ escrowId: transaction.id, raisedBy: "admin", reason: notes, evidence: [] }),
      });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Dispute failed");
      setItems((list) => list.map((item) => item.id === transaction.id ? { ...item, status: "disputed", dispute_reason: notes } : item));
      saveEscrowOverride(transaction.id, { status: "disputed", dispute_reason: notes });
      saveOrderOverride(transaction.order_id, { status: "disputed", escrow_status: "disputed", updated_at: new Date().toISOString() });
      setDisputeId("");
      setNotes("");
      setStampId(transaction.id);
      toast.success("Dispute opened");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Dispute failed");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">ORIGINO Protected</span>
          <h1 className="mt-4 text-4xl">Escrow</h1>
          <p className="mt-2 max-w-2xl text-[var(--ink-soft)]">Authorise milestone release only after inspection or delivery conditions are satisfied. Disputes freeze funds and record an admin reason.</p>
        </div>
        <div className="text-right">
          <p className="metric-numeral text-4xl">{formatMoney(totalHeld, "USD")}</p>
          <p className="small-caps text-sm">Currently held</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <select className="input-editorial" value={filter} onChange={(event) => setFilter(event.target.value as EscrowStatus | "all")}>
          <option value="all">All statuses</option>
          <option value="funded">Funded</option>
          <option value="released">Released</option>
          <option value="disputed">Disputed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {visibleItems.map((transaction) => {
          const order = orderById.get(transaction.order_id);
          const canRelease = transaction.status === "funded";
          const canDispute = transaction.status === "funded" || transaction.status === "pending";
          return (
            <article className="border p-5" key={transaction.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl">{transaction.id}</h2>
                    <span className={`badge-patch ${statusClass(transaction.status)} ${stampId === transaction.id ? "animate-pulse" : ""}`}>{transaction.status}</span>
                  </div>
                  <p className="mt-2 metric-numeral text-3xl">{formatMoney(transaction.amount_usd, transaction.currency)}</p>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">Order {transaction.order_id} {order ? `/ ${order.quantity} ${order.unit} / ${order.status}` : ""}</p>
                  <p className="mt-1 text-sm text-[var(--ink-soft)]">Funded {formatDate(transaction.funded_at)}</p>
                  {transaction.released_at && <p className="mt-1 text-sm text-[var(--forest)]">Released {formatDate(transaction.released_at)}</p>}
                  {transaction.dispute_reason && <p className="mt-2 border border-[var(--terracotta)] p-3 text-sm text-[var(--terracotta)]">Dispute: {transaction.dispute_reason}</p>}
                  {stampId === transaction.id && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Transaction updated</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-pill btn-pill-forest min-h-[44px] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { setReleaseId(transaction.id); setConfirmed(false); }} disabled={!canRelease || loadingId === `release-${transaction.id}`}>
                    {transaction.status === "released" ? "Released" : transaction.status === "disputed" ? "Funds Frozen" : "Authorise Release"}
                  </button>
                  <button className="btn-pill btn-pill-outline min-h-[44px] disabled:cursor-not-allowed disabled:opacity-50" onClick={() => { setDisputeId(transaction.id); setNotes(""); }} disabled={!canDispute || loadingId === `dispute-${transaction.id}`}>
                    {transaction.status === "disputed" ? "Disputed" : "Open Dispute"}
                  </button>
                </div>
              </div>

              {releaseId === transaction.id && (
                <div className="mt-5 border border-[var(--terracotta)] p-4">
                  <span className="badge-patch stamp-reject">Two-Step Confirmation</span>
                  <h3 className="mt-3 text-2xl">Release Funds</h3>
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">Are you sure? This action cannot be undone. Funds will be marked released to the supplier for this milestone.</p>
                  <label className="mt-3 flex min-h-[44px] items-center gap-2">
                    <input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
                    I understand this permanently releases this escrow milestone.
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setReleaseId("")}>Cancel</button>
                    <button className="btn-pill btn-pill-forest min-h-[44px] disabled:cursor-not-allowed disabled:opacity-50" disabled={!confirmed || loadingId === `release-${transaction.id}`} onClick={() => releaseFunds(transaction)}>
                      {loadingId === `release-${transaction.id}` ? "Releasing..." : "Final Release"}
                    </button>
                  </div>
                </div>
              )}

              {disputeId === transaction.id && (
                <div className="mt-5 border border-[var(--terracotta)] p-4">
                  <span className="badge-patch stamp-reject">Dispute Form</span>
                  <h3 className="mt-3 text-2xl">Open Dispute</h3>
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">Opening a dispute freezes this transaction in the admin queue until the evidence is reviewed.</p>
                  <textarea className="input-editorial mt-3 min-h-[120px]" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Reason, evidence summary, and next action" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setDisputeId("")}>Cancel</button>
                    <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => openDispute(transaction)} disabled={loadingId === `dispute-${transaction.id}`}>
                      {loadingId === `dispute-${transaction.id}` ? "Opening..." : "Submit Dispute"}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
