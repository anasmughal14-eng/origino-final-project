"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

type Screening = {
  entity: string;
  result: string;
  lists: string[];
  status: "pending" | "cleared" | "blocked" | "escalated";
};

export default function SanctionsClient() {
  const [entity, setEntity] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [screenings, setScreenings] = useState<Screening[]>([
    { entity: "Crescent Surgical Works", result: "clear", lists: ["OFAC", "UN", "EU", "HMT"], status: "cleared" },
    { entity: "Black Eagle Trading", result: "possible_match", lists: ["OFAC", "UN", "EU", "HMT"], status: "pending" },
  ]);

  async function runCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!entity.trim()) {
      setError("Entity name is required.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/sanctions/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityName: entity, notes }),
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok || !payload.success) {
      setError(payload.error ?? "Sanctions check failed.");
      return;
    }
    setScreenings((current) => [{ entity, result: payload.data.result, lists: payload.data.lists_checked, status: payload.data.result === "clear" ? "cleared" : "pending" }, ...current]);
    setEntity("");
    setNotes("");
    toast.success("Sanctions check completed");
  }

  function decide(entityName: string, status: Screening["status"]) {
    setScreenings((current) => current.map((item) => item.entity === entityName ? { ...item, status } : item));
    toast.success(`Entity ${status}`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">Sanctions Queue</h1>
          <p className="mt-3 max-w-3xl text-[#5a5a54]">Screen suppliers and buyers against OFAC, UN, EU, and HMT before admin approval.</p>
        </div>
        <span className="badge-patch tier-certified">Compliance gate</span>
      </div>

      <form className="mt-6 border border-[#e2ddd8] p-5" onSubmit={runCheck}>
        <h2 className="text-2xl">Run manual screening</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Entity name</span>
            <input className="input-editorial" value={entity} onChange={(event) => setEntity(event.target.value)} placeholder="Company or owner name" />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Admin notes</span>
            <input className="input-editorial" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="NTN, owner, country context" />
          </label>
          <button className="btn-pill btn-pill-forest min-h-[44px]" disabled={loading}>{loading ? "Checking..." : "Check"}</button>
        </div>
        {error && <p className="mt-3 text-sm text-[#c0623a]">{error}</p>}
      </form>

      <div className="mt-6 space-y-3">
        {screenings.map((item) => (
          <div className="border border-[#e2ddd8] p-4" key={item.entity}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl">{item.entity}</h2>
                <p className="mt-1 text-sm text-[#5a5a54]">Result: {item.result} / Lists: {item.lists.join(", ")}</p>
              </div>
              <span className={`badge-patch ${item.status === "blocked" ? "text-[#c0623a]" : ""}`}>{item.status}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => decide(item.entity, "cleared")}>Clear</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => decide(item.entity, "escalated")}>Escalate</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => decide(item.entity, "blocked")}>Block</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
