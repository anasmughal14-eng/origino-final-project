"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AgentSettingsPage() {
  const [form, setForm] = useState({
    name: "Adeel Sourcing Desk",
    payoutMethod: "Bank transfer",
    iban: "PK36SCBL0000001123456702",
    emailAlerts: true,
    buyerApprovals: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.name.trim() || !form.payoutMethod.trim()) {
      setError("Agent name and payout method are required.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast.success("Agent settings saved");
    }, 350);
  }

  return (
    <div>
      <p className="badge-patch">Agent Account</p>
      <h1 className="mt-4 text-4xl">Settings</h1>
      <p className="mt-2 max-w-3xl text-[#5a5a54]">Manage agent profile, payout details, buyer approval alerts, and security preferences.</p>
      <form className="mt-6 grid gap-4 border p-5 md:grid-cols-2" onSubmit={save}>
        <label><span className="label-editorial">Agent Name</span><input className="input-editorial" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label><span className="label-editorial">Payout Method</span><select className="input-editorial" value={form.payoutMethod} onChange={(event) => setForm({ ...form, payoutMethod: event.target.value })}><option>Bank transfer</option><option>Wallet payout</option><option>Manual invoice</option></select></label>
        <label className="md:col-span-2"><span className="label-editorial">Bank / IBAN Reference</span><input className="input-editorial" value={form.iban} onChange={(event) => setForm({ ...form, iban: event.target.value })} /></label>
        <label className="flex min-h-[44px] items-center gap-3 border p-3"><input checked={form.emailAlerts} type="checkbox" onChange={(event) => setForm({ ...form, emailAlerts: event.target.checked })} /> Email alerts</label>
        <label className="flex min-h-[44px] items-center gap-3 border p-3"><input checked={form.buyerApprovals} type="checkbox" onChange={(event) => setForm({ ...form, buyerApprovals: event.target.checked })} /> Buyer link approvals</label>
        {error && <p className="text-sm text-[#c0623a] md:col-span-2">{error}</p>}
        <button className="btn-pill btn-pill-forest" disabled={loading}>{loading ? "Saving..." : "Save Settings"}</button>
      </form>
    </div>
  );
}
