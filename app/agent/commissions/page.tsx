"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { agentClients, agentOrders } from "../agent-data";

export default function AgentCommissionsPage() {
  const [downloaded, setDownloaded] = useState(false);
  const earned = agentOrders.reduce((sum, order) => sum + order.commissionUsd, 0);

  function downloadStatement() {
    const rows = agentOrders.map((order) => {
      const client = agentClients.find((item) => item.id === order.clientId);
      return `${order.id},${client?.company ?? "Client"},${order.supplier},${order.commissionUsd}`;
    });
    const blob = new Blob([["order,client,supplier,commission_usd", ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "origino-agent-commission-statement.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    toast.success("Commission statement downloaded");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="badge-patch">Commission Statement</p>
          <h1 className="mt-4 text-4xl">Commissions</h1>
          <p className="mt-2 text-[#5a5a54]">Confirmed order commissions and referral attribution for agent-led deals.</p>
        </div>
        <button className="btn-pill btn-pill-forest" onClick={downloadStatement}>{downloaded ? "Downloaded" : "Download Statement"}</button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="border p-5"><p className="metric-numeral text-3xl">${earned.toLocaleString()}</p><p className="text-sm text-[#5a5a54]">Earned</p></div>
        <div className="border p-5"><p className="metric-numeral text-3xl">$3,550</p><p className="text-sm text-[#5a5a54]">Pending</p></div>
        <div className="border p-5"><p className="metric-numeral text-3xl">{agentOrders.length}</p><p className="text-sm text-[#5a5a54]">Commissioned orders</p></div>
      </div>
      <div className="mt-6 space-y-3">
        {agentOrders.map((order) => <div className="flex flex-wrap justify-between gap-4 border p-5" key={order.id}><div><strong>{order.id}</strong><p className="text-sm text-[#5a5a54]">{order.supplier}</p></div><p className="metric-numeral">${order.commissionUsd.toLocaleString()}</p></div>)}
      </div>
    </div>
  );
}
