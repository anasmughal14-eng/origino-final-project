"use client";

import type { Product } from "@/types/database";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BuyerSamplesClient({ products }: { products: Product[] }) {
  const [requests, setRequests] = useState<Array<{ id: string; product: string; status: string }>>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function requestSample(product: Product) {
    setLoadingId(product.id);
    try {
      const response = await fetch("/api/sample-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierId: product.supplier_id, productId: product.id, quantity: 1 }),
      });
      const json = await response.json();
      if (!json.success) throw new Error(json.error || "Sample request failed");
      setRequests((items) => [{ id: json.data.requestId, product: product.name, status: "pending" }, ...items]);
      toast.success("Sample request sent");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sample request failed");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div>
      <span className="badge-patch">SAMPLE DESK</span>
      <h1 className="mt-4 text-4xl">Samples</h1>
      <p className="mt-3 max-w-3xl text-[#5a5a54]">Request samples from products marked as sample-ready and track the local request status.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <div className="border border-[#e2ddd8] p-5" key={product.id}>
            <h2 className="text-2xl">{product.name}</h2>
            <p className="mt-2 text-sm text-[#5a5a54]">{product.category} / MOQ {product.moq} {product.moq_unit}</p>
            <p className="metric-numeral mt-3">Sample ${product.sample_price_usd}</p>
            <button className="btn-pill btn-pill-forest mt-4" disabled={loadingId === product.id} onClick={() => requestSample(product)}>
              {loadingId === product.id ? "Sending..." : "Request Sample"}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-3">
        {requests.map((request) => <div className="flex justify-between border border-[#e2ddd8] p-4" key={request.id}><span>{request.product}</span><span className="badge-patch">{request.status}</span></div>)}
      </div>
    </div>
  );
}
