"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function BuyerDisputesPage() {
  const [form, setForm] = useState({ orderId: "ord-6", reason: "" });
  const [items, setItems] = useState([{ id: "disp-1", orderId: "ord-6", status: "open", reason: "Inspection evidence mismatch under admin review." }]);

  async function openDispute() {
    if (!form.reason.trim()) {
      toast.error("Dispute reason is required");
      return;
    }
    setItems((current) => [{ id: `disp-${Date.now()}`, orderId: form.orderId, status: "open", reason: form.reason }, ...current]);
    setForm({ ...form, reason: "" });
    toast.success("Dispute opened for admin review");
  }

  return (
    <div>
      <span className="badge-patch">ORIGINO PROTECTED</span>
      <h1 className="mt-4 text-4xl">Disputes</h1>
      <p className="mt-3 max-w-3xl text-[#5a5a54]">Open and track buyer disputes tied to protected orders and inspection evidence.</p>
      <div className="mt-8 border border-[#e2ddd8] p-5">
        <label><span className="label-editorial">Order</span><select className="input-editorial" value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })}><option value="ord-6">ord-6</option><option value="ord-1">ord-1</option></select></label>
        <label className="mt-4 block"><span className="label-editorial">Reason</span><textarea className="input-editorial min-h-28" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} /></label>
        <button className="btn-pill btn-pill-forest mt-4" onClick={openDispute}>Open Dispute</button>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((item) => <div className="border border-[#e2ddd8] p-4" key={item.id}><div className="flex justify-between"><strong>{item.orderId}</strong><span className="badge-patch">{item.status}</span></div><p className="mt-2 text-[#5a5a54]">{item.reason}</p></div>)}
      </div>
    </div>
  );
}
