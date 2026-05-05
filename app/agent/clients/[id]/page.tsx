import Link from "next/link";
import { notFound } from "next/navigation";
import { agentClients, agentInquiries, agentOrders, agentRfqs } from "../../agent-data";

export default function AgentClientDetailPage({ params }: { params: { id: string } }) {
  const client = agentClients.find((item) => item.id === params.id);
  if (!client) notFound();
  const inquiries = agentInquiries.filter((item) => item.clientId === client.id);
  const rfqs = agentRfqs.filter((item) => item.clientId === client.id);
  const orders = agentOrders.filter((item) => item.clientId === client.id);

  return (
    <div>
      <Link className="btn-pill btn-pill-outline" href="/agent/clients">Back to Clients</Link>
      <div className="mt-6 border-b border-[#e2ddd8] pb-6">
        <p className="badge-patch">{client.status}</p>
        <h1 className="mt-4 text-4xl">{client.company}</h1>
        <p className="mt-2 text-[#5a5a54]">{client.contact} / {client.country} / {client.categories}</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="border p-5"><p className="metric-numeral text-3xl">{client.intentScore}</p><p className="text-sm text-[#5a5a54]">Intent score</p></div>
        <div className="border p-5"><p className="metric-numeral text-3xl">{inquiries.length}</p><p className="text-sm text-[#5a5a54]">Inquiries</p></div>
        <div className="border p-5"><p className="metric-numeral text-3xl">{orders.length}</p><p className="text-sm text-[#5a5a54]">Orders</p></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link className="btn-pill btn-pill-forest" href={`/agent/inquiries?client=${client.id}`}>Submit Inquiry</Link>
        <Link className="btn-pill btn-pill-outline" href={`/agent/rfq?client=${client.id}`}>Create RFQ</Link>
        <Link className="btn-pill btn-pill-outline" href="/agent/commissions">View Commission</Link>
      </div>
      <section className="mt-8 border p-5">
        <h2 className="text-2xl">Active Workflows</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {inquiries.map((item) => <div className="border p-4" key={item.id}><strong>{item.subject}</strong><p className="badge-patch mt-2">{item.status}</p></div>)}
          {rfqs.map((item) => <div className="border p-4" key={item.id}><strong>{item.title}</strong><p className="badge-patch mt-2">{item.status}</p></div>)}
          {orders.map((item) => <div className="border p-4" key={item.id}><strong>{item.supplier}</strong><p className="metric-numeral mt-2">${item.amountUsd.toLocaleString()}</p></div>)}
        </div>
      </section>
    </div>
  );
}
