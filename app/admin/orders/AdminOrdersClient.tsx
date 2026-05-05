"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { applyOrderOverrides, saveOrderOverride } from "@/app/components/shared/sellerMockStore";
import type { Order, Product, Supplier } from "@/types/database";

type StatusFilter = Order["status"] | "all";

const buyerNames: Record<string, string> = {
  "buyer-1": "Hansa Medical Imports GmbH",
  "buyer-2": "Nord Textile Buyers",
};

const timeline = ["confirmed", "in_production", "quality_check", "shipped", "delivered"] as const;

function statusClass(status: Order["status"] | Order["escrow_status"]) {
  if (status === "disputed" || status === "cancelled" || status === "refunded") return "stamp-reject";
  if (status === "delivered" || status === "released") return "stamp-approve";
  return "stamp-pending";
}

export default function AdminOrdersClient({ orders, suppliers, products }: { orders: Order[]; suppliers: Supplier[]; products: Product[] }) {
  const [items, setItems] = useState(orders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [open, setOpen] = useState("");
  const [loadingId, setLoadingId] = useState("");
  const [stampId, setStampId] = useState("");

  useEffect(() => {
    let active = true;
    async function hydrateOrders() {
      let source = orders;
      try {
        const response = await fetch("/api/orders");
        const payload = await response.json() as { success: boolean; data?: { orders?: Order[] } };
        if (payload.success && Array.isArray(payload.data?.orders)) source = payload.data.orders;
      } catch {
        source = orders;
      }
      if (active) setItems(applyOrderOverrides(source));
    }
    void hydrateOrders();
    return () => {
      active = false;
    };
  }, [orders]);

  const supplierById = useMemo(() => new Map(suppliers.map((supplier) => [supplier.id, supplier])), [suppliers]);
  const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);
  const filtered = useMemo(() => items.filter((order) => {
    const supplier = supplierById.get(order.supplier_id);
    const product = order.product_id ? productById.get(order.product_id) : null;
    const haystack = `${order.id} ${order.status} ${order.escrow_status} ${supplier?.company_name ?? ""} ${product?.name ?? ""} ${buyerNames[order.buyer_id] ?? order.buyer_id}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (status === "all" || order.status === status);
  }), [items, productById, query, status, supplierById]);

  async function patchOrder(id: string, update: Partial<Order>, message: string) {
    setLoadingId(id);
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...update }),
      });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Order update failed");
      setItems((list) => list.map((order) => order.id === id ? { ...order, ...update } : order));
      saveOrderOverride(id, { ...update, updated_at: new Date().toISOString() });
      setStampId(id);
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Order update failed");
    } finally {
      setLoadingId("");
    }
  }

  const totalHeld = items.filter((order) => order.escrow_status === "funded").reduce((sum, order) => sum + order.total_usd, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">Order Oversight</span>
          <h1 className="mt-4 text-4xl">Admin Orders</h1>
          <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">Track buyer/supplier order records, escrow status, shipment milestones, and dispute flags from one admin desk.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-right">
          <div><p className="metric-numeral text-3xl">{items.length}</p><p className="small-caps text-sm">Orders</p></div>
          <div><p className="metric-numeral text-3xl">${totalHeld.toLocaleString()}</p><p className="small-caps text-sm">Escrow Held</p></div>
          <div><p className="metric-numeral text-3xl">{items.filter((order) => order.status === "disputed").length}</p><p className="small-caps text-sm">Disputes</p></div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_240px]">
        <input className="input-editorial" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order, buyer, supplier, product" />
        <select className="input-editorial" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="in_production">In production</option>
          <option value="quality_check">Quality check</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="disputed">Disputed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="mt-8 space-y-4">
        {filtered.map((order) => {
          const supplier = supplierById.get(order.supplier_id);
          const product = order.product_id ? productById.get(order.product_id) : null;
          const isOpen = open === order.id;
          return (
            <div className="border" key={order.id}>
              <button className="flex min-h-[64px] w-full flex-wrap items-center justify-between gap-4 p-4 text-start" onClick={() => setOpen(isOpen ? "" : order.id)}>
                <span>
                  <span className="font-semibold">{order.id}</span>
                  <span className="mx-2 text-[var(--ink-muted)]">/</span>
                  <span>{product?.name ?? "General order"}</span>
                  {stampId === order.id && <span className="ml-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Updated</span>}
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className={`badge-patch ${statusClass(order.status)}`}>{order.status.replace("_", " ")}</span>
                  <span className={`badge-patch ${statusClass(order.escrow_status)}`}>{order.escrow_status.replace("_", " ")}</span>
                  <span className="metric-numeral text-lg">${order.total_usd.toLocaleString()}</span>
                </span>
              </button>

              {isOpen && (
                <div className="border-t p-5">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="small-caps text-sm">Buyer</p>
                      <p className="mt-1 font-semibold">{buyerNames[order.buyer_id] ?? order.buyer_id}</p>
                    </div>
                    <div>
                      <p className="small-caps text-sm">Supplier</p>
                      {supplier ? <Link className="mt-1 block font-semibold underline-offset-4 hover:underline" href={`/admin/suppliers/${supplier.id}`}>{supplier.company_name}</Link> : <p>{order.supplier_id}</p>}
                    </div>
                    <div>
                      <p className="small-caps text-sm">Public Profile</p>
                      {supplier ? <Link className="mt-1 block underline-offset-4 hover:underline" href={`/suppliers/${supplier.slug}`}>View supplier</Link> : <p>Not available</p>}
                    </div>
                    <div>
                      <p className="small-caps text-sm">Escrow Desk</p>
                      <Link className="mt-1 block underline-offset-4 hover:underline" href="/admin/escrow">Open escrow</Link>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-[1fr_260px]">
                    <div className="border p-4">
                      <p className="small-caps text-sm">Shipment Timeline</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {timeline.map((step) => (
                          <span className={`badge-patch ${timeline.indexOf(step) <= Math.max(0, timeline.indexOf(order.status as (typeof timeline)[number])) ? "stamp-approve" : ""}`} key={step}>{step.replace("_", " ")}</span>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-[var(--ink-muted)]">Tracking: {order.tracking_number ?? "Not assigned"} / Payment: {order.payment_method}</p>
                      <p className="mt-2 text-sm text-[var(--ink-muted)]">{order.notes}</p>
                    </div>
                    <div className="border p-4">
                      <p className="small-caps text-sm">Admin Status Update</p>
                      <select className="input-editorial mt-3" value={order.status} onChange={(event) => patchOrder(order.id, { status: event.target.value as Order["status"] }, "Order status updated")} disabled={loadingId === order.id}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in_production">In production</option>
                        <option value="quality_check">Quality check</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="disputed">Disputed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => patchOrder(order.id, { escrow_status: "disputed", status: "disputed" }, "Order moved to dispute")} disabled={loadingId === order.id}>Open Dispute</button>
                        <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => patchOrder(order.id, { status: "delivered", escrow_status: order.escrow_status === "funded" ? "released" : order.escrow_status }, "Order marked delivered")} disabled={loadingId === order.id}>Mark Delivered</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="mt-6 border p-6 text-center">No orders match this filter.</div>}
    </div>
  );
}
