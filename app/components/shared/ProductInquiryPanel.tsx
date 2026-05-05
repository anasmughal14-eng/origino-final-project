"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import InquiryForm from "@/app/components/shared/InquiryForm";

type ProductInquiryPanelProps = {
  supplierId: string;
  supplierName: string;
  supplierSlug: string;
  productId: string;
  productName: string;
  sampleAvailable: boolean;
};

export default function ProductInquiryPanel({
  supplierId,
  supplierName,
  supplierSlug,
  productId,
  productName,
  sampleAvailable,
}: ProductInquiryPanelProps) {
  const [loadingSample, setLoadingSample] = useState(false);

  async function requestSample() {
    setLoadingSample(true);
    const response = await fetch("/api/sample-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, productId, quantity: 1 }),
    });
    const json = (await response.json()) as { success: boolean; data?: { requestId: string }; error?: string };
    setLoadingSample(false);
    if (!json.success) {
      toast.error(json.error ?? "Sample request failed");
      return;
    }
    toast.success("Sample request saved");
  }

  return (
    <aside className="panel-soft h-fit p-5">
      <h2 className="text-2xl">Request Quote or Sample</h2>
      <p className="my-3 text-sm text-[#5a5a54]">
        Supplier: <Link className="underline underline-offset-4" href={`/suppliers/${supplierSlug}`}>{supplierName}</Link>
      </p>
      <InquiryForm supplierId={supplierId} />
      <button className="btn-pill btn-pill-outline mt-4 min-h-[44px] w-full" onClick={requestSample} disabled={!sampleAvailable || loadingSample}>
        {loadingSample ? "Requesting..." : sampleAvailable ? `Request Sample: ${productName}` : "Sample unavailable"}
      </button>
    </aside>
  );
}
