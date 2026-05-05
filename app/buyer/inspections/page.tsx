"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function BuyerInspectionsPage() {
  const [form, setForm] = useState(() => {
    const requestedOrder = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("order") : null;
    return { orderId: requestedOrder ?? "ord-1", requestedDate: "", notes: "" };
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Array<{ id: string; orderId: string; status: string; result: "pass" | "fail" | "pending" }>>([
    { id: "INS-2401", orderId: "ord-1", status: "completed", result: "pass" },
    { id: "INS-2402", orderId: "ord-2", status: "completed", result: "fail" },
  ]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.orderId || !form.requestedDate) {
      setError("Order and inspection date are required.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/inspection/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: form.orderId, scheduledDate: form.requestedDate, notes: form.notes, supplierId: "sup-1", buyerId: "buyer-1" }),
    });
    const json = (await response.json()) as { success?: boolean; data?: { bookingId?: string; status?: string }; error?: string };
    setLoading(false);
    if (!response.ok || !json.success) {
      setError(json.error ?? "Inspection booking failed.");
      return;
    }
    setError("");
    setBookings((list) => [{ id: json.data?.bookingId ?? `INS-${Date.now()}`, orderId: form.orderId, status: json.data?.status ?? "pending", result: "pending" }, ...list]);
    toast.success("Inspection booked");
  }

  return (
    <div>
      <h1 className="text-4xl">Inspections</h1>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={submit}>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Order</span>
          <select className="input-editorial min-h-[44px]" value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })}><option>ord-1</option><option>ord-2</option></select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Inspection date</span>
          <input className="input-editorial min-h-[44px]" type="date" value={form.requestedDate} onChange={(event) => setForm({ ...form, requestedDate: event.target.value })} />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Notes</span>
          <textarea className="input-editorial min-h-[120px]" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Inspection notes" />
        </label>
        {error && <p className="text-sm text-[#c0623a] md:col-span-2">{error}</p>}
        <button className="btn-pill btn-pill-forest min-h-[44px]" disabled={loading}>{loading ? "Booking..." : "Book Inspection"}</button>
      </form>
      <div className="mt-8 grid gap-4 md:grid-cols-2">{bookings.map((booking) => <div className="border p-5" key={booking.id}><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-2xl">{booking.id}</h2><p className="mt-1 text-sm text-[#5a5a54]">Order {booking.orderId} / {booking.status}</p></div><span className={`badge-patch ${booking.result === "pass" ? "stamp-approve" : booking.result === "fail" ? "stamp-reject" : ""}`}>{booking.result}</span></div><button className="btn-pill btn-pill-outline mt-4 min-h-[44px]" onClick={() => toast.success("Inspection report will download after provider upload")}>Download Report</button></div>)}</div>
    </div>
  );
}
