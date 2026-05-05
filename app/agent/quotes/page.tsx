"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { agentClients, agentQuotes, type AgentQuote } from "../agent-data";

export default function AgentQuotesPage() {
  const [quotes, setQuotes] = useState<AgentQuote[]>(agentQuotes);
  const [counterId, setCounterId] = useState("");
  const [counter, setCounter] = useState("");

  function update(id: string, status: AgentQuote["status"]) {
    setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, status } : quote));
    toast.success(`Quote marked ${status}`);
  }

  function sendCounter(id: string) {
    const amount = Number(counter);
    if (!amount || Number.isNaN(amount)) {
      toast.error("Counter amount must be numeric");
      return;
    }
    setQuotes((current) => current.map((quote) => quote.id === id ? { ...quote, amountUsd: amount, status: "countered" } : quote));
    setCounter("");
    setCounterId("");
    toast.success("Counter-offer recorded for buyer");
  }

  return (
    <div>
      <p className="badge-patch">Negotiation Support</p>
      <h1 className="mt-4 text-4xl">Agent Quotes</h1>
      <p className="mt-2 max-w-3xl text-[#5a5a54]">Track supplier quotes, buyer counter-offers, and accepted deals for linked clients.</p>
      <div className="mt-6 space-y-4">
        {quotes.map((quote) => {
          const client = agentClients.find((item) => item.id === quote.clientId);
          return (
            <section className="border p-5" key={quote.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="badge-patch">{quote.status}</p>
                  <h2 className="mt-3 text-2xl">{quote.supplier}</h2>
                  <p className="mt-1 text-sm text-[#5a5a54]">For {client?.company ?? "linked buyer"}</p>
                </div>
                <p className="metric-numeral text-3xl">${quote.amountUsd.toLocaleString()}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="btn-pill btn-pill-forest" onClick={() => update(quote.id, "accepted")} disabled={quote.status === "accepted"}>Accept</button>
                <button className="btn-pill btn-pill-outline" onClick={() => setCounterId(counterId === quote.id ? "" : quote.id)}>Counter</button>
                <button className="btn-pill btn-pill-outline" onClick={() => update(quote.id, "rejected")} disabled={quote.status === "rejected"}>Reject</button>
              </div>
              {counterId === quote.id && (
                <div className="mt-4 flex flex-wrap gap-2 border p-4">
                  <input className="input-editorial max-w-xs" inputMode="decimal" placeholder="Counter amount" value={counter} onChange={(event) => setCounter(event.target.value)} />
                  <button className="btn-pill btn-pill-forest" onClick={() => sendCounter(quote.id)}>Send Counter</button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
