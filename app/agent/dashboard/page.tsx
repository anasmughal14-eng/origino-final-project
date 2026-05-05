import Link from "next/link";
import { agentClients, agentInquiries, agentOrders, agentQuotes, agentRfqs } from "../agent-data";

export default function AgentDashboardPage() {
  const commission = agentOrders.reduce((sum, order) => sum + order.commissionUsd, 0);
  const linkedClients = agentClients.filter((client) => client.status === "linked");

  return (
    <div>
      <p className="badge-patch">Agent Portal</p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-[#e2ddd8] pb-6">
        <div>
          <h1 className="text-4xl">Dashboard</h1>
          <p className="mt-2 max-w-3xl text-[#5a5a54]">Manage linked buyer clients, behalf-of sourcing work, RFQs, orders, and commission earnings.</p>
        </div>
        <Link className="btn-pill btn-pill-forest" href="/agent/clients">Manage Clients</Link>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{linkedClients.length}</p><p className="text-sm text-[#5a5a54]">Linked clients</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{agentInquiries.length}</p><p className="text-sm text-[#5a5a54]">Active inquiries</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{agentRfqs.length}</p><p className="text-sm text-[#5a5a54]">Open RFQs</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">${commission.toLocaleString()}</p><p className="text-sm text-[#5a5a54]">Earned commission</p></div>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <section className="dashboard-card p-5">
          <h2 className="text-2xl">Client Work</h2>
          <div className="mt-4 space-y-3">
            {agentClients.map((client) => (
              <Link className="dashboard-card block p-4" href={`/agent/clients/${client.id}`} key={client.id}>
                <div className="flex flex-wrap justify-between gap-2"><strong>{client.company}</strong><span className="badge-patch">{client.status}</span></div>
                <p className="mt-1 text-sm text-[#5a5a54]">{client.country} / intent {client.intentScore}</p>
              </Link>
            ))}
          </div>
        </section>
        <section className="dashboard-card p-5">
          <h2 className="text-2xl">Quote Follow-up</h2>
          <div className="mt-4 space-y-3">
            {agentQuotes.map((quote) => (
              <Link className="dashboard-card block p-4" href="/agent/quotes" key={quote.id}>
                <div className="flex flex-wrap justify-between gap-2"><strong>{quote.supplier}</strong><span className="badge-patch">{quote.status}</span></div>
                <p className="metric-numeral mt-1">${quote.amountUsd.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
