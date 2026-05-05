"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function BuyerReviewsPage() {
  const [form, setForm] = useState({ supplierId: "sup-1", orderId: "ord-1", rating: "5", body: "" });
  const [submitted, setSubmitted] = useState<Array<{ id: string; supplier: string; rating: string; body: string }>>([]);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!form.body.trim()) {
      toast.error("Review note is required");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await response.json();
      if (!json.success) throw new Error(json.error || "Review failed");
      setSubmitted((items) => [{ id: json.data.reviewId, supplier: form.supplierId, rating: form.rating, body: form.body }, ...items]);
      setForm({ ...form, body: "" });
      toast.success("Review submitted for moderation");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Review failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <span className="badge-patch">POST ORDER TRUST</span>
      <h1 className="mt-4 text-4xl">Reviews</h1>
      <p className="mt-3 max-w-3xl text-[#5a5a54]">Submit moderated supplier reviews after completed orders.</p>
      <div className="mt-8 border border-[#e2ddd8] p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <label><span className="label-editorial">Supplier</span><select className="input-editorial" value={form.supplierId} onChange={(event) => setForm({ ...form, supplierId: event.target.value })}><option value="sup-1">Crescent Surgical Works</option><option value="sup-2">Nishat Weaves Faisalabad</option></select></label>
          <label><span className="label-editorial">Order</span><select className="input-editorial" value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })}><option value="ord-1">ord-1</option><option value="ord-2">ord-2</option></select></label>
          <label><span className="label-editorial">Rating</span><select className="input-editorial" value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })}><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label>
        </div>
        <label className="mt-4 block"><span className="label-editorial">Review</span><textarea className="input-editorial min-h-32" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} /></label>
        <button className="btn-pill btn-pill-forest mt-4" disabled={loading} onClick={submit}>{loading ? "Submitting..." : "Submit Review"}</button>
      </div>
      <div className="mt-6 space-y-3">
        {submitted.map((item) => <div className="border border-[#e2ddd8] p-4" key={item.id}><strong>{item.rating}/5</strong><p className="mt-2">{item.body}</p><span className="badge-patch mt-3">PENDING MODERATION</span></div>)}
      </div>
    </div>
  );
}
