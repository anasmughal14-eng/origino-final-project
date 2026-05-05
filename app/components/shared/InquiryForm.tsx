"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function InquiryForm({ supplierId }: { supplierId: string }) {
  const [form, setForm] = useState({ name: "", company: "", email: "", quantity: "", message: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    if (error) setError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.name || !form.company || !form.email || !form.message) {
      setError("Name, company, email, and message are required.");
      return;
    }
    if (form.quantity && Number.isNaN(Number(form.quantity))) {
      setError("Quantity must be a number.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/contact-supplier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, ...form, quantity: form.quantity ? Number(form.quantity) : undefined }),
    });
    const json = (await response.json()) as { success: boolean; error?: string };
    setLoading(false);
    if (!json.success) {
      setError(json.error ?? "Could not send inquiry.");
      return;
    }
    setForm({ name: "", company: "", email: "", quantity: "", message: "" });
    toast.success("Inquiry sent.");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Your name</span>
        <input className="input-editorial min-h-[44px]" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Amina Khan" />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Company</span>
        <input className="input-editorial min-h-[44px]" value={form.company} onChange={(event) => update("company", event.target.value)} placeholder="Northstar Imports" />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Email</span>
        <input className="input-editorial min-h-[44px]" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="buyer@example.com" />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Quantity</span>
        <input className="input-editorial min-h-[44px]" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} placeholder="1000" inputMode="numeric" />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Message</span>
        <textarea className="input-editorial min-h-[120px]" value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Share target specs, market, and delivery window." />
      </label>
      {error && <p className="text-sm text-[#c0623a]">{error}</p>}
      <button className="btn-pill btn-pill-forest min-h-[44px] w-full sm:w-auto" disabled={loading}>{loading ? "Sending..." : "Send Inquiry"}</button>
    </form>
  );
}
