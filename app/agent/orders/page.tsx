"use client";

import { useState } from "react";
import { agentClients, agentOrders } from "../agent-data";

export default function AgentOrdersPage() {
  const [openId, setOpenId] = useState(agentOrders[0]?.id ?? "");

  return (
    <div>
      <p className="badge-patch">Client Orders</p>
      <h1 className="mt-4 text-4xl">Agent Orders</h1>
      <p className="mt-2 max-w-3xl text-[#5a5a54]">Track client orders, shipment status, and agent commission attribution.</p>
      <div className="mt-6 space-y-3">
        {agentOrders.map((order) => {
          const client = agentClients.find((item) => item.id === order.clientId);
          const open = openId === order.id;
          return (
            <section className="border p-5" key={order.id}>
              <button className="flex w-full flex-wrap items-center justify-between gap-4 text-left" onClick={() => setOpenId(open ? "" : order.id)}>
                <span><strong>{order.id}</strong><span className="ml-3 text-sm text-[#5a5a54]">{client?.company} / {order.supplier}</span></span>
                <span className="badge-patch">{order.status}</span>
              </button>
              {open && (
                <div className="mt-4 grid gap-4 border-t pt-4 md:grid-cols-3">
                  <div><p className="label-editorial">Order Value</p><p className="metric-numeral">${order.amountUsd.toLocaleString()}</p></div>
                  <div><p className="label-editorial">Agent Commission</p><p className="metric-numeral">${order.commissionUsd.toLocaleString()}</p></div>
                  <div><p className="label-editorial">Attribution</p><p>{client?.company} linked by agent</p></div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
