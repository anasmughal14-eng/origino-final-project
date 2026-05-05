"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { agentClients, agentInquiries, type AgentInquiry } from "../agent-data";

function AgentInquiriesContent() {
  const selectedClient = useSearchParams().get("client") ?? agentClients[0]?.id ?? "";
  const [items, setItems] = useState<AgentInquiry[]>(agentInquiries);
  const [form, setForm] = useState({ clientId: selectedClient, supplier: "Crescent Surgical Works", subject: "", message: "" });
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.clientId || !form.supplier.trim() || !form.subject.trim() || !form.message.trim()) {
      setError("Client, supplier, subject, and message are required.");
      return;
    }
    const client = agentClients.find((item) => item.id === form.clientId);
    setItems((current) => [{ id: `ainq-${Date.now()}`, clientId: form.clientId, supplier: form.supplier, subject: form.subject, status: "open", submittedBy: `Agent on behalf of ${client?.company ?? "buyer"}` }, ...current]);
    setForm({ ...form, subject: "", message: "" });
    toast.success("Inquiry submitted on behalf of buyer");
  }

  function markQuoted(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: "quoted" } : item));
    toast.success("Inquiry moved to quote follow-up");
  }

  return (
    <div>
      <p className="badge-patch">Behalf-of Messaging</p>
      <h1 className="mt-4 text-4xl">Agent Inquiries</h1>
      <p className="mt-2 max-w-3xl text-[#5a5a54]">Submit and monitor supplier inquiries for linked buyers. Each record keeps the behalf-of attribution visible.</p>
      <form className="mt-6 grid gap-3 border p-5 md:grid-cols-2" onSubmit={submit}>
        <select className="input-editorial" value={form.clientId} onChange={(event) => setForm({ ...form, clientId: event.target.value })}>
          {agentClients.map((client) => <option key={client.id} value={client.id}>{client.company}</option>)}
        </select>
        <input className="input-editorial" placeholder="Supplier" value={form.supplier} onChange={(event) => setForm({ ...form, supplier: event.target.value })} />
        <input className="input-editorial md:col-span-2" placeholder="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
        <textarea className="input-editorial min-h-28 md:col-span-2" placeholder="Buyer requirements" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
        {error && <p className="text-sm text-[#c0623a] md:col-span-2">{error}</p>}
        <button className="btn-pill btn-pill-forest">Submit Inquiry</button>
      </form>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div className="flex flex-wrap items-center justify-between gap-4 border p-5" key={item.id}>
            <div>
              <h2 className="text-2xl">{item.subject}</h2>
              <p className="mt-1 text-sm text-[#5a5a54]">{item.supplier}</p>
              <p className="mt-2 text-sm">{item.submittedBy}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge-patch">{item.status}</span>
              <button className="btn-pill btn-pill-outline" onClick={() => markQuoted(item.id)}>Send Quote Follow-up</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AgentInquiriesPage() {
  return (
    <Suspense fallback={<div className="border p-5">Loading agent inquiries...</div>}>
      <AgentInquiriesContent />
    </Suspense>
  );
}
