"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { saveOrderOverride } from "@/app/components/shared/sellerMockStore";
import type { Order } from "@/types/database";

export default function OrderSelfReport({ orderId }: { orderId: string }) {
  const [status, setStatus] = useState("in_production");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!notes.trim()) {
      setError("Notes are required for a self-report update.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status, notes }),
    });
    const json = (await response.json()) as { success: boolean; error?: string };
    setLoading(false);
    if (!json.success) {
      setError(json.error ?? "Order update failed.");
      return;
    }
    saveOrderOverride(orderId, { status: status as Order["status"], notes, updated_at: new Date().toISOString() });
    setNotes("");
    setError("");
    toast.success(`Order ${orderId} update submitted`);
  }

  return (
    <form className="mt-4 space-y-3" onSubmit={submit}>
      <select className="input-editorial min-h-[44px]" value={status} onChange={(event) => setStatus(event.target.value)}><option>in_production</option><option>quality_check</option><option>shipped</option><option>delivered</option></select>
      <textarea className="input-editorial min-h-[100px]" value={notes} onChange={(event) => { setError(""); setNotes(event.target.value); }} placeholder="Notes" />
      {error && <p className="text-sm text-[#c0623a]">{error}</p>}
      <button className="btn-pill btn-pill-forest min-h-[44px]" disabled={loading}>{loading ? "Submitting..." : "Submit Update"}</button>
    </form>
  );
}
