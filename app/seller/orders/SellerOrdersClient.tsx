"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Order } from "@/types/database";
import { applyOrderOverrides } from "@/app/components/shared/sellerMockStore";

export default function SellerOrdersClient({ orders }: { orders: Order[] }) {
  const [items, setItems] = useState(orders);
  const [expandedId, setExpandedId] = useState("");

  useEffect(() => {
    function syncOrders() {
      setItems(applyOrderOverrides(orders));
    }
    syncOrders();
    window.addEventListener("storage", syncOrders);
    window.addEventListener("origino:seller-mock-store", syncOrders);
    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("origino:seller-mock-store", syncOrders);
    };
  }, [orders]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">Order Self-Reporting</span>
          <h1 className="mt-4 text-4xl">Orders</h1>
          <p className="mt-2 text-[#5a5a54]">Confirmed orders, quote-created orders, shipment status, escrow state, and seller milestone reporting.</p>
        </div>
        <Link className="btn-pill btn-pill-forest min-h-[44px]" href="/seller/orders/report">Report Off-Platform Order</Link>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((order) => (
          <div className="flex flex-wrap items-center justify-between gap-3 border p-4" key={order.id}>
            <div>
              <p className="font-semibold">{order.id}</p>
              <p className="text-sm text-[#5a5a54]">{order.status.replaceAll("_", " ")} / escrow {order.escrow_status.replaceAll("_", " ")} / ${order.total_usd.toLocaleString()}</p>
              {order.notes && <p className="mt-2 text-sm text-[#5a5a54]">{order.notes}</p>}
            </div>
            {order.id.startsWith("order-") || order.id.startsWith("ord-local-") ? (
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setExpandedId(expandedId === order.id ? "" : order.id)}>View</button>
            ) : (
              <Link className="btn-pill btn-pill-outline min-h-[44px]" href={`/seller/orders/${order.id}`}>View</Link>
            )}
            {expandedId === order.id && (
              <div className="basis-full border-t pt-4">
                <div className="flex flex-wrap gap-2">
                  {["confirmed", "in_production", "quality_check", "shipped", "delivered"].map((item) => <span className={`badge-patch ${item === order.status ? "stamp-approve" : ""}`} key={item}>{item.replaceAll("_", " ")}</span>)}
                </div>
                <p className="mt-3 text-sm text-[#5a5a54]">Quote-created order held in escrow. Full Supabase mode will persist it to the orders table and unlock the permanent detail URL.</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="mt-6 border p-6">No orders yet.</div>}
    </div>
  );
}
