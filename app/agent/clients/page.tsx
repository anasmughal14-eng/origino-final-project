"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { agentClients, type AgentClient } from "../agent-data";

export default function AgentClientsPage() {
  const [clients, setClients] = useState<AgentClient[]>(agentClients);
  const [form, setForm] = useState({ company: "", contact: "", country: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.company.trim() || !form.contact.trim() || !form.country.trim()) {
      setError("Company, contact, and country are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Valid buyer email is required for the invite.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setClients((current) => [{ id: `client-${Date.now()}`, company: form.company, contact: form.contact, country: form.country, categories: "Pending intake", status: "pending", intentScore: 40 }, ...current]);
    setForm({ company: "", contact: "", country: "", email: "" });
    setLoading(false);
    toast.success("Buyer invite prepared");
  }

  return (
    <div>
      <p className="badge-patch">Client Management</p>
      <h1 className="mt-4 text-4xl">Clients</h1>
      <p className="mt-2 max-w-3xl text-[#5a5a54]">Invite buyers, track link confirmation, and open behalf-of sourcing workflows.</p>
      <form className="mt-6 grid gap-3 border p-5 md:grid-cols-4" onSubmit={invite}>
        <input className="input-editorial" placeholder="Buyer company" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
        <input className="input-editorial" placeholder="Contact name" value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} />
        <input className="input-editorial" placeholder="Country" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} />
        <input className="input-editorial" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        {error && <p className="text-sm text-[#c0623a] md:col-span-4">{error}</p>}
        <button className="btn-pill btn-pill-forest md:col-span-1" disabled={loading}>{loading ? "Inviting..." : "Invite Buyer"}</button>
      </form>
      <div className="mt-6 space-y-3">
        {clients.map((client) => (
          <div className="flex flex-wrap items-center justify-between gap-4 border p-5" key={client.id}>
            <div>
              <h2 className="text-2xl">{client.company}</h2>
              <p className="mt-1 text-sm text-[#5a5a54]">{client.contact} / {client.country} / {client.categories}</p>
              <p className="metric-numeral mt-2 text-sm">Intent {client.intentScore}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge-patch">{client.status}</span>
              <Link className="btn-pill btn-pill-outline" href={`/agent/clients/${client.id}`}>View</Link>
              <Link className="btn-pill btn-pill-outline" href={`/agent/inquiries?client=${client.id}`}>Submit Inquiry</Link>
              <Link className="btn-pill btn-pill-forest" href={`/agent/rfq?client=${client.id}`}>Create RFQ</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
