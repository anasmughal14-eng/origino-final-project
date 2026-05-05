"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const tiers = [
  {
    name: "Basic",
    price: 299,
    delivery: "3 weeks",
    features: ["Brand audit and consultation call", "Logo design with 3 concepts", "Business card and letterhead", "LinkedIn and Instagram setup", "1 page English product overview PDF", "Basic marketplace listing"],
  },
  {
    name: "Growth",
    price: 799,
    delivery: "6 weeks",
    features: ["Everything in Basic", "Product photography for up to 10 products", "5 page English SEO website", "HS code and incoterms guide", "2 social content packs", "Featured profile and buyer-network campaign"],
  },
  {
    name: "Premium",
    price: 1999,
    delivery: "10 weeks",
    features: ["Everything in Growth", "Unlimited product photography", "2-3 minute brand video", "Full catalog website", "ORIGINO export readiness certification", "Dedicated account manager for 3 months", "5 vetted buyer introductions", "Priority sponsored listing and analytics"],
  },
];

export default function SellerMarketingPage() {
  const [loadingTier, setLoadingTier] = useState("");
  const currentTier = "Growth";

  async function selectTier(tier: typeof tiers[number]) {
    setLoadingTier(tier.name);
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: `marketing-${tier.name.toLowerCase()}`,
        amountUsd: tier.price,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/seller/marketing?checkout=success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/seller/marketing?checkout=cancelled`,
      }),
    });
    const json = (await response.json()) as { success?: boolean; data?: { url?: string }; error?: string };
    setLoadingTier("");
    if (!response.ok || !json.success) {
      toast.error(json.error ?? "Checkout failed");
      return;
    }
    toast.success("Stripe checkout session ready");
    if (json.data?.url) window.location.href = json.data.url;
  }

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-[rgba(26,26,24,0.12)] pb-6">
        <p className="badge-patch mb-1">Seller growth services</p>
        <h1 className="text-4xl">Marketing Packages</h1>
        <p className="max-w-3xl text-sm leading-6 text-[#5a5a54]">
          Select a package after audit review. Growth and Premium use 50/50 milestone payments, and every paid order receives an SLA due date for admin follow-up.
        </p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {tiers.map((tier) => (
          <div className={`flex flex-col border p-5 ${tier.name === currentTier ? "border-[#2d4a3e] bg-[#e8f0ec]" : ""}`} key={tier.name}>
            <div className="flex justify-between gap-3">
              <h2 className="text-2xl">{tier.name}</h2>
              {tier.name === currentTier && <span className="badge-patch">Current Plan</span>}
            </div>
            <p className="metric-numeral mt-3 text-3xl">${tier.price}</p>
            <p className="mt-1 text-sm text-[#5a5a54]">Delivery: {tier.delivery}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm leading-6">{tier.features.map((feature) => <li className="border-t border-[#e2ddd8] pt-2" key={feature}>{feature}</li>)}</ul>
            <button className="btn-pill btn-pill-forest mt-5 min-h-[44px]" onClick={() => selectTier(tier)} disabled={loadingTier === tier.name || tier.name === currentTier}>
              {tier.name === currentTier ? "Current Plan" : loadingTier === tier.name ? "Preparing..." : `Select ${tier.name}`}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {["Stripe", "JazzCash", "EasyPaisa", "Bank Transfer"].map((method) => (
          <div className="border p-4 text-sm" key={method}>{method}</div>
        ))}
      </div>
    </div>
  );
}
