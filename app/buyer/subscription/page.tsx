"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const plans = [
  { name: "Standard", price: "$0", active: true, features: ["Marketplace access", "Supplier comparison", "Basic RFQs", "Saved suppliers"] },
  { name: "Verified Importer", price: "$49/mo", active: false, features: ["Verified importer badge", "Priority supplier responses", "Early access to new suppliers", "Monthly sourcing brief"] },
  { name: "Enterprise", price: "$199/mo", active: false, features: ["API key access", "Dedicated sourcing desk", "Saved search alerts", "Bulk RFQ support"] },
];

export default function BuyerSubscriptionPage() {
  const [active, setActive] = useState("Standard");
  const [loading, setLoading] = useState("");

  async function selectPlan(name: string) {
    if (name === active) return;
    setLoading(name);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setLoading("");
    setActive(name);
    toast.success(`${name} selected`);
  }

  return (
    <div>
      <div className="border-b border-[rgba(26,26,24,0.12)] pb-6">
        <p className="badge-patch mb-3">Buyer trust</p>
        <h1 className="text-4xl">Subscription</h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5a5a54]">Premium buyer membership for verified importer status, early supplier access, saved alerts, and enterprise API access.</p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <div className={`flex flex-col border p-5 ${active === plan.name ? "border-[#2d4a3e] bg-[#e8f0ec]" : ""}`} key={plan.name}>
            <div className="flex flex-wrap justify-between gap-2">
              <h2 className="text-2xl">{plan.name}</h2>
              {active === plan.name && <span className="badge-patch">Current</span>}
            </div>
            <p className="metric-numeral mt-4 text-3xl">{plan.price}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">{plan.features.map((feature) => <li className="border-t border-[#e2ddd8] pt-2" key={feature}>{feature}</li>)}</ul>
            <button className="btn-pill btn-pill-forest mt-5 min-h-[44px]" onClick={() => selectPlan(plan.name)} disabled={loading === plan.name || active === plan.name}>{active === plan.name ? "Current Plan" : loading === plan.name ? "Selecting..." : `Select ${plan.name}`}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
