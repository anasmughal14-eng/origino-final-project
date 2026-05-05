"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewRfqClient() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Surgical & Medical Instruments");
  const [quantity, setQuantity] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [destination, setDestination] = useState("");
  const [certifications, setCertifications] = useState("ISO 13485, CE");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ rfqId: string; matchedSuppliers: number } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!title.trim()) return setError("RFQ title is required.");
    if (!description.trim()) return setError("Product requirements are required.");
    if (!quantity || Number(quantity) <= 0) return setError("Quantity must be a positive number.");
    setLoading(true);
    const response = await fetch("/api/rfq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, quantity: Number(quantity), targetPrice, destination, certifications, description }),
    });
    const payload = await response.json();
    setLoading(false);
    if (!response.ok || !payload.success) {
      setError(payload.error ?? "RFQ submission failed.");
      return;
    }
    setResult({ rfqId: payload.data.rfqId, matchedSuppliers: payload.data.matchedSuppliers });
    toast.success("RFQ published");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">New RFQ</h1>
          <p className="mt-3 max-w-3xl text-[#5a5a54]">Create a structured request that can be matched to verified suppliers by category, certification, destination, and quantity.</p>
        </div>
        <Link className="btn-pill btn-pill-outline min-h-[44px]" href="/buyer/rfq">Back to RFQs</Link>
      </div>

      <form className="mt-6 border border-[#e2ddd8] p-5" onSubmit={submit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">RFQ title</span>
            <input className="input-editorial" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="CE surgical scissors, 5,000 pieces" />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Category</span>
            <select className="input-editorial" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>Surgical & Medical Instruments</option>
              <option>Textiles & Apparel</option>
              <option>Leather Goods</option>
              <option>Food & Agriculture</option>
              <option>Engineering & Light Manufacturing</option>
            </select>
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Quantity</span>
            <input className="input-editorial" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="5000" />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Target price</span>
            <input className="input-editorial" value={targetPrice} onChange={(event) => setTargetPrice(event.target.value)} placeholder="$2.40 per piece" />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Destination</span>
            <input className="input-editorial" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Hamburg, Germany" />
          </label>
          <label>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Required certifications</span>
            <input className="input-editorial" value={certifications} onChange={(event) => setCertifications(event.target.value)} placeholder="ISO 13485, CE" />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Product requirements</span>
          <textarea className="input-editorial min-h-[120px]" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Material, packaging, testing, incoterms, sample needs, and deadline" />
        </label>
        {error && <p className="mt-3 text-sm text-[#c0623a]">{error}</p>}
        <button className="btn-pill btn-pill-forest mt-4 min-h-[44px]" disabled={loading}>{loading ? "Publishing..." : "Publish RFQ"}</button>
      </form>

      {result && (
        <div className="mt-6 border border-[#2d4a3e] p-5">
          <h2 className="text-2xl">RFQ published</h2>
          <p className="mt-2 text-[#5a5a54]">Reference {result.rfqId}. {result.matchedSuppliers} matching suppliers are ready for notification when Supabase/email is connected.</p>
        </div>
      )}
    </div>
  );
}
