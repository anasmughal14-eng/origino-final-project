"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { agentClients, agentRfqs, type AgentRfq } from "../agent-data";

function AgentRfqContent() {
  const selectedClient = useSearchParams().get("client") ?? agentClients[0]?.id ?? "";
  const [items, setItems] = useState<AgentRfq[]>(agentRfqs);
  const [form, setForm] = useState({ clientId: selectedClient, title: "", category: "Surgical & Medical Instruments" });
  const [error, setError] = useState("");

  function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.clientId || !form.title.trim() || !form.category.trim()) {
      setError("Client, RFQ title, and category are required.");
      return;
    }
    setItems((current) => [{ id: `arfq-${Date.now()}`, clientId: form.clientId, title: form.title, category: form.category, status: "open", matches: 0 }, ...current]);
    setForm({ ...form, title: "" });
    toast.success("RFQ opened for supplier matching");
  }

  function match(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: "matched", matches: Math.max(item.matches, 3) } : item));
    toast.success("Supplier matches attached");
  }

  return (
    <div>
      <p className="badge-patch">RFQ Matching</p>
      <h1 className="mt-4 text-4xl">Agent RFQs</h1>
      <p className="mt-2 max-w-3xl text-[#5a5a54]">Create RFQs on behalf of linked buyers and track supplier match status.</p>
      <form className="mt-6 grid gap-3 border p-5 md:grid-cols-3" onSubmit={create}>
        <select className="input-editorial" value={form.clientId} onChange={(event) => setForm({ ...form, clientId: event.target.value })}>{agentClients.map((client) => <option key={client.id} value={client.id}>{client.company}</option>)}</select>
        <input className="input-editorial" placeholder="RFQ title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <select className="input-editorial" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Surgical & Medical Instruments</option><option>Textiles & Apparel</option><option>Engineering & Light Manufacturing</option></select>
        {error && <p className="text-sm text-[#c0623a] md:col-span-3">{error}</p>}
        <button className="btn-pill btn-pill-forest">Create RFQ</button>
      </form>
      <div className="mt-6 space-y-3">
        {items.map((item) => <div className="flex flex-wrap items-center justify-between gap-4 border p-5" key={item.id}><div><h2 className="text-2xl">{item.title}</h2><p className="mt-1 text-sm text-[#5a5a54]">{item.category}</p><p className="metric-numeral mt-2">{item.matches} matches</p></div><div className="flex flex-wrap gap-2"><span className="badge-patch">{item.status}</span><button className="btn-pill btn-pill-outline" onClick={() => match(item.id)}>Run Matching</button></div></div>)}
      </div>
    </div>
  );
}

export default function AgentRfqPage() {
  return (
    <Suspense fallback={<div className="border p-5">Loading agent RFQs...</div>}>
      <AgentRfqContent />
    </Suspense>
  );
}
