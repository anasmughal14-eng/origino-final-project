"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Quote } from "@/types/database";

type AdminQuotesClientProps = {
  initialQuotes: Quote[];
};

export default function AdminQuotesClient({ initialQuotes }: AdminQuotesClientProps) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [status, setStatus] = useState("all");

  const visibleQuotes = useMemo(
    () => quotes.filter((quote) => status === "all" || quote.status === status),
    [quotes, status],
  );

  function setQuoteStatus(id: string, nextStatus: Quote["status"]) {
    setQuotes((current) => current.map((quote) => (quote.id === id ? { ...quote, status: nextStatus } : quote)));
    toast.success(`Quote ${nextStatus}.`);
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Negotiation oversight</span>
          <h1>Quotes</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Monitor structured quote chains, counter-offers, accepted quotes, and order conversion.
          </p>
        </div>
        <select className="input-editorial min-h-11 max-w-xs" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="countered">Countered</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {(["pending", "countered", "accepted", "rejected"] as const).map((item) => (
          <div className="border p-5" key={item}>
            <p className="metric-text text-3xl">{quotes.filter((quote) => quote.status === item).length}</p>
            <p className="mt-2 capitalize text-ink-soft">{item}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        {visibleQuotes.map((quote) => (
          <div className="border p-5" key={quote.id}>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap gap-3">
                  <span className="badge-patch">{quote.status}</span>
                  <span className="badge-patch">{quote.currency}</span>
                </div>
                <h2 className="mt-3 text-2xl">Quote {quote.id}</h2>
                <p className="mt-2 metric-text">
                  ${(quote.final_price_usd ?? quote.offered_price_usd ?? quote.target_price_usd ?? 0).toLocaleString()} / {quote.quantity} {quote.unit}
                </p>
                <p className="mt-2 text-ink-soft">
                  Lead time {quote.lead_time_offered ?? quote.lead_time_requested ?? "not set"} / Expires {quote.expires_at ?? "not set"}
                </p>
                {quote.notes ? <p className="mt-2 text-sm text-ink-muted">{quote.notes}</p> : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => setQuoteStatus(quote.id, "countered")}>
                  Mark Countered
                </button>
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => setQuoteStatus(quote.id, "rejected")}>
                  Reject
                </button>
                <button className="btn-pill btn-pill-forest" type="button" onClick={() => setQuoteStatus(quote.id, "accepted")}>
                  Accept
                </button>
                {quote.status === "accepted" ? (
                  <Link className="btn-pill btn-pill-outline" href="/admin/orders">
                    View Order Flow
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
