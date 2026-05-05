"use client";

import Link from "next/link";
import { useState } from "react";
import type { Order } from "@/types/database";

const milestones = ["Confirmed", "Production", "Inspection", "Shipment", "Delivered"];

export default function BuyerOrdersClient({ orders }: { orders: Order[] }) {
  const [open, setOpen] = useState(orders[0]?.id ?? "");
  const buyerOrders = orders.slice(0, 5);

  return (
    <div>
      <div className="border-b border-[rgba(26,26,24,0.12)] pb-6">
        <p className="badge-patch mb-3">Shipment tracker</p>
        <h1 className="text-4xl">Orders</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5a5a54]">Track shipment milestones, expand order details, and book inspection when the order is in quality check or inspection pending.</p>
      </div>
      <div className="mt-6 space-y-3">
        {buyerOrders.map((order) => {
          const eligibleForInspection = ["inspection_pending", "in_production", "confirmed"].includes(order.status);
          return (
            <div className="border p-4" key={order.id}>
              <button className="flex min-h-[44px] w-full items-center justify-between gap-3 text-start" onClick={() => setOpen(open === order.id ? "" : order.id)}>
                <span><span className="font-semibold">{order.id}</span><br /><span className="text-sm text-[#5a5a54]">{order.quantity.toLocaleString()} {order.unit} / ${order.total_usd.toLocaleString()}</span></span>
                <span className="badge-patch">{order.status}</span>
              </button>
              {open === order.id && (
                <div className="mt-4 border-t border-[#e2ddd8] pt-4">
                  <div className="flex flex-wrap gap-2">
                    {milestones.map((item, index) => <span className={`badge-patch ${index <= 2 ? "stamp-approve" : ""}`} key={item}>{item}</span>)}
                  </div>
                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <div><span className="text-[#8a8a82]">Escrow</span><p className="metric-numeral">{order.escrow_status}</p></div>
                    <div><span className="text-[#8a8a82]">Payment</span><p>{order.payment_method}</p></div>
                    <div><span className="text-[#8a8a82]">Tracking</span><p>{order.tracking_number ?? "Pending carrier update"}</p></div>
                  </div>
                  {eligibleForInspection && <Link className="btn-pill btn-pill-forest mt-4 min-h-[44px]" href={`/buyer/inspections?order=${order.id}`}>Book Inspection</Link>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
