"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type AgentRecord = {
  id: string;
  name: string;
  region: string;
  clients: number;
  activeOrders: number;
  commissionUsd: number;
  status: "pending" | "approved" | "suspended";
  notes: string;
};

const seedAgents: AgentRecord[] = [
  { id: "agent-1", name: "Bilal Khan", region: "GCC buyers", clients: 6, activeOrders: 2, commissionUsd: 1840, status: "approved", notes: "Handles UAE hospitality buyers and shared-container sourcing." },
  { id: "agent-2", name: "Ayesha Malik", region: "EU medical importers", clients: 3, activeOrders: 1, commissionUsd: 920, status: "pending", notes: "Needs admin approval before submitting RFQs on behalf of buyers." },
  { id: "agent-3", name: "Hamza Rafiq", region: "UK retail", clients: 4, activeOrders: 0, commissionUsd: 410, status: "approved", notes: "Referral commission verified for textile inquiries." },
];

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState(seedAgents);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AgentRecord["status"] | "all">("all");
  const [active, setActive] = useState<AgentRecord | null>(null);
  const [note, setNote] = useState("");

  const filtered = useMemo(() => agents.filter((agent) => {
    const haystack = `${agent.name} ${agent.region} ${agent.status}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase())) && (status === "all" || agent.status === status);
  }), [agents, query, status]);

  function updateAgent(id: string, update: Partial<AgentRecord>, message: string) {
    setAgents((list) => list.map((agent) => agent.id === id ? { ...agent, ...update } : agent));
    toast.success(message);
  }

  function openReview(agent: AgentRecord) {
    setActive(agent);
    setNote(agent.notes);
  }

  function saveDecision(statusValue: AgentRecord["status"]) {
    if (!active) return;
    if (!note.trim()) {
      toast.error("Admin note is required");
      return;
    }
    updateAgent(active.id, { status: statusValue, notes: note }, `Agent ${statusValue}`);
    setActive(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">Agent Network</span>
          <h1 className="mt-4 text-4xl">Agents</h1>
          <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">Approve agents, inspect linked clients, monitor active orders, and track commission exposure.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-right">
          <div><p className="metric-numeral text-3xl">{agents.filter((agent) => agent.status === "pending").length}</p><p className="small-caps text-sm">Pending</p></div>
          <div><p className="metric-numeral text-3xl">{agents.reduce((sum, agent) => sum + agent.clients, 0)}</p><p className="small-caps text-sm">Clients</p></div>
          <div><p className="metric-numeral text-3xl">${agents.reduce((sum, agent) => sum + agent.commissionUsd, 0).toLocaleString()}</p><p className="small-caps text-sm">Commission</p></div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_240px]">
        <input className="input-editorial" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search agent or region" />
        <select className="input-editorial" value={status} onChange={(event) => setStatus(event.target.value as AgentRecord["status"] | "all")}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="mt-8 grid gap-4">
        {filtered.map((agent) => (
          <div className="grid gap-4 border p-5 lg:grid-cols-[1fr_160px_160px_180px]" key={agent.id}>
            <div>
              <h2 className="text-2xl">{agent.name}</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">{agent.region}</p>
              <p className="mt-3 text-sm">{agent.notes}</p>
            </div>
            <div><p className="metric-numeral text-2xl">{agent.clients}</p><p className="small-caps text-sm">Linked clients</p></div>
            <div><p className="metric-numeral text-2xl">${agent.commissionUsd.toLocaleString()}</p><p className="small-caps text-sm">Commission</p></div>
            <div className="flex flex-wrap items-start justify-end gap-2">
              <span className="badge-patch w-full text-center">{agent.status}</span>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => openReview(agent)}>Review</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => updateAgent(agent.id, { status: "suspended" }, "Agent suspended")}>Suspend</button>
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => updateAgent(agent.id, { status: "approved" }, "Agent approved")}>Approve</button>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.45)] p-4">
          <div className="modal-surface w-full max-w-xl">
            <span className="badge-patch">Agent Review</span>
            <h2 className="mt-4 text-3xl">{active.name}</h2>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">{active.clients} clients · {active.activeOrders} active orders · ${active.commissionUsd.toLocaleString()} commission</p>
            <textarea className="input-editorial mt-4 min-h-[130px]" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Admin approval or suspension note" />
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setActive(null)}>Cancel</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => saveDecision("suspended")}>Suspend</button>
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => saveDecision("approved")}>Approve Agent</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
