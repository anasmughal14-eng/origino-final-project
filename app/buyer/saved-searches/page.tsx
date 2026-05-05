"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

type SavedSearch = { id: string; name: string; filters: string; alerts: boolean };

export default function BuyerSavedSearchesPage() {
  const [items, setItems] = useState<SavedSearch[]>([
    { id: "ss-1", name: "Sialkot CE instruments", filters: "Sialkot / ISO 13485 / CE", alerts: true },
    { id: "ss-2", name: "EU home textiles", filters: "Faisalabad / OEKO-TEX / MOQ under $5k", alerts: false },
  ]);
  const [form, setForm] = useState({ name: "", filters: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggle(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, alerts: !item.alerts } : item));
    toast.success("Alert preference updated");
  }

  function remove(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Saved search removed");
  }

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.name.trim()) {
      setError("Search name is required.");
      return;
    }
    if (!form.filters.trim()) {
      setError("At least one filter description is required.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/saved-searches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, filters: form.filters }),
    });
    const payload = await response.json() as { success: boolean; error?: string; data?: { savedSearchId?: string } };
    setLoading(false);
    if (!payload.success) {
      setError(payload.error ?? "Unable to save search.");
      return;
    }
    setItems((current) => [{ id: payload.data?.savedSearchId ?? `ss-${Date.now()}`, name: form.name.trim(), filters: form.filters.trim(), alerts: true }, ...current]);
    setForm({ name: "", filters: "" });
    toast.success("Saved search created");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">SEARCH ALERTS</span>
          <h1 className="mt-4 text-4xl">Saved Searches</h1>
          <p className="mt-3 text-[#5a5a54]">Manage buyer alerts for matching suppliers and products.</p>
        </div>
        <Link className="btn-pill btn-pill-forest" href="/marketplace">Create Search</Link>
      </div>
      <form className="mt-6 grid gap-3 border border-[#e2ddd8] p-5 md:grid-cols-[1fr_1fr_auto]" onSubmit={create}>
        <label>
          <span className="label-editorial">Search name</span>
          <input className="input-editorial" value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} placeholder="EU surgical instruments" />
        </label>
        <label>
          <span className="label-editorial">Filters</span>
          <input className="input-editorial" value={form.filters} onChange={(event) => setForm((value) => ({ ...value, filters: event.target.value }))} placeholder="Sialkot / CE / MOQ under $3k" />
        </label>
        <button className="btn-pill btn-pill-forest min-h-[44px] self-end" disabled={loading}>{loading ? "Saving..." : "Save Search"}</button>
        {error && <p className="text-sm text-[#c0623a] md:col-span-3">{error}</p>}
      </form>
      <div className="mt-8 space-y-3">
        {items.length === 0 && <div className="border border-dashed p-6 text-sm text-[#5a5a54]">No saved searches yet. Add one above or create one from the marketplace filters.</div>}
        {items.map((item) => (
          <div className="flex flex-wrap items-center justify-between gap-4 border border-[#e2ddd8] p-5" key={item.id}>
            <div>
              <h2 className="text-2xl">{item.name}</h2>
              <p className="mt-1 text-sm text-[#5a5a54]">{item.filters}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-pill btn-pill-outline" onClick={() => toggle(item.id)}>{item.alerts ? "Alerts On" : "Alerts Off"}</button>
              <Link className="btn-pill btn-pill-outline" href={`/marketplace?search=${encodeURIComponent(item.name)}`}>Run</Link>
              <button className="btn-pill btn-pill-outline" onClick={() => remove(item.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
