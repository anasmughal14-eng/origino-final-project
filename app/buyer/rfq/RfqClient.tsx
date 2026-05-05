"use client";

import Link from "next/link";
import { useState } from "react";

const seedRfqs = [
  { id: "RFQ-2401", title: "CE dental forceps set", category: "Surgical & Medical Instruments", status: "Open", matches: 4, responses: 2 },
  { id: "RFQ-2402", title: "OEKO-TEX hotel towels", category: "Textiles & Apparel", status: "Reviewing", matches: 3, responses: 3 },
  { id: "RFQ-2403", title: "Halal spice private label", category: "Food & Agriculture", status: "Draft", matches: 2, responses: 0 },
];

export default function RfqClient() {
  const [status, setStatus] = useState("all");
  const rfqs = seedRfqs.filter((rfq) => status === "all" || rfq.status.toLowerCase() === status);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">RFQs</h1>
          <p className="mt-3 max-w-3xl text-[#5a5a54]">Track buyer RFQs, supplier matches, and incoming responses before converting the best response into a quote or order.</p>
        </div>
        <Link className="btn-pill btn-pill-forest min-h-[44px]" href="/buyer/rfq/new">Create RFQ</Link>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {["all", "open", "reviewing", "draft"].map((item) => (
          <button className={`btn-pill min-h-[44px] ${status === item ? "btn-pill-forest" : "btn-pill-outline"}`} key={item} onClick={() => setStatus(item)}>
            {item}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {rfqs.map((rfq) => (
          <div className="grid gap-3 border border-[#e2ddd8] p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center" key={rfq.id}>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8a8a82]">{rfq.id} / {rfq.category}</p>
              <h2 className="mt-2 text-2xl">{rfq.title}</h2>
            </div>
            <p className="metric-numeral">{rfq.matches} matches</p>
            <p className="metric-numeral">{rfq.responses} responses</p>
            <span className="badge-patch">{rfq.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
