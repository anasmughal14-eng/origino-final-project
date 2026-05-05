"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const initialForm = {
  buyerName: "",
  buyerEmail: "",
  product: "",
  quantity: "",
  agreedPriceUsd: "",
  expectedShipmentDate: "",
};

export default function SellerOrderReportForm() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportedOrderId, setReportedOrderId] = useState("");

  function update(field: keyof typeof form, value: string) {
    if (error) setError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.buyerName.trim()) return setError("Buyer name is required.");
    if (!form.buyerEmail.includes("@")) return setError("A valid buyer email is required.");
    if (!form.product.trim()) return setError("Product is required.");
    if (!form.quantity.trim()) return setError("Quantity is required.");
    if (!form.agreedPriceUsd || Number.isNaN(Number(form.agreedPriceUsd))) return setError("Agreed price must be numeric.");
    if (!form.expectedShipmentDate) return setError("Expected shipment date is required.");

    setLoading(true);
    const response = await fetch("/api/orders/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyerName: form.buyerName,
        buyerEmail: form.buyerEmail,
        product: form.product,
        quantity: form.quantity,
        agreedPriceUsd: Number(form.agreedPriceUsd),
        expectedShipmentDate: form.expectedShipmentDate,
      }),
    });
    const json = (await response.json()) as { success: boolean; data?: { orderId?: string; status?: string }; error?: string };
    setLoading(false);
    if (!json.success) {
      setError(json.error ?? "Order report failed.");
      return;
    }
    setForm(initialForm);
    setReportedOrderId(json.data?.orderId ?? "");
    toast.success("Buyer confirmation request queued.");
  }

  return (
    <form className="mt-6 grid gap-4 border border-[rgba(26,26,24,0.16)] p-5 md:grid-cols-2" onSubmit={submit}>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Buyer name</span>
        <input className="input-editorial min-h-[44px]" value={form.buyerName} onChange={(event) => update("buyerName", event.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Buyer email</span>
        <input className="input-editorial min-h-[44px]" type="email" value={form.buyerEmail} onChange={(event) => update("buyerEmail", event.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Product</span>
        <input className="input-editorial min-h-[44px]" value={form.product} onChange={(event) => update("product", event.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Quantity</span>
        <input className="input-editorial min-h-[44px]" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Agreed price USD</span>
        <input className="input-editorial min-h-[44px]" inputMode="decimal" value={form.agreedPriceUsd} onChange={(event) => update("agreedPriceUsd", event.target.value)} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Expected shipment date</span>
        <input className="input-editorial min-h-[44px]" type="date" value={form.expectedShipmentDate} onChange={(event) => update("expectedShipmentDate", event.target.value)} />
      </label>
      <div className="md:col-span-2">
        <p className="text-sm leading-6 text-[#5a5a54]">Submitting this queues the buyer confirmation step required by the ORIGINO commission workflow.</p>
        {error && <p className="mt-2 text-sm text-[#c0623a]">{error}</p>}
        {reportedOrderId && <p className="mt-2 text-sm text-[#2d4a3e]">Reported order: {reportedOrderId}. Status: awaiting buyer confirmation.</p>}
        <button className="btn-pill btn-pill-forest mt-4 min-h-[44px]" disabled={loading}>{loading ? "Reporting..." : "Report Order"}</button>
      </div>
    </form>
  );
}
