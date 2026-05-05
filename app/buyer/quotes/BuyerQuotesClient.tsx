"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { applyQuoteOverrides, saveCreatedEscrow, saveCreatedOrder, saveQuoteOverride } from "@/app/components/shared/sellerMockStore";
import type { Order, Quote } from "@/types/database";

type HistoryItem = {
  id: string;
  label: string;
  body: string;
  createdAt: string;
};

type QuoteState = Quote & { history: HistoryItem[] };

const STORAGE_KEY = "origino_buyer_quote_overrides";

function baseHistory(quote: Quote): HistoryItem[] {
  const history: HistoryItem[] = [
    { id: `${quote.id}-request`, label: "Buyer request", body: `${quote.quantity.toLocaleString()} ${quote.unit}, target $${quote.target_price_usd ?? "open"}`, createdAt: quote.created_at },
    { id: `${quote.id}-supplier`, label: "Supplier quote", body: `$${quote.offered_price_usd ?? "pending"} offered, ${quote.lead_time_offered ?? "lead time pending"}`, createdAt: quote.updated_at },
  ];
  if (quote.status === "accepted") {
    history.push({ id: `${quote.id}-accepted`, label: "Buyer accepted", body: "Order opened from accepted quote; escrow required.", createdAt: quote.updated_at });
  }
  if (quote.status === "countered") {
    history.push({ id: `${quote.id}-countered`, label: "Buyer counter", body: "Counter-offer is waiting for supplier review.", createdAt: quote.updated_at });
  }
  if (quote.status === "rejected") {
    history.push({ id: `${quote.id}-rejected`, label: "Buyer rejected", body: "Quote rejected by buyer.", createdAt: quote.updated_at });
  }
  return history;
}

function readOverrides(): Record<string, Partial<QuoteState>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Record<string, Partial<QuoteState>> : {};
  } catch {
    return {};
  }
}

function writeOverride(quoteId: string, update: Partial<QuoteState>) {
  if (typeof window === "undefined") return;
  const current = readOverrides();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, [quoteId]: { ...current[quoteId], ...update } }));
}

export default function BuyerQuotesClient({ quotes }: { quotes: Quote[] }) {
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("inquiry");
  const [items, setItems] = useState<QuoteState[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [counterId, setCounterId] = useState("");
  const [rejectId, setRejectId] = useState("");
  const [counter, setCounter] = useState({ price: "", leadTime: "", note: "" });
  const [loadingId, setLoadingId] = useState("");

  const visibleItems = useMemo(() => {
    if (!inquiryId) return items;
    return items;
  }, [items, inquiryId]);

  useEffect(() => {
    let active = true;
    async function hydrateQuotes() {
      const overrides = readOverrides();
      let source = quotes;
      try {
        const response = await fetch("/api/quotes");
        const payload = await response.json() as { success: boolean; data?: Quote[] };
        if (payload.success && Array.isArray(payload.data)) source = payload.data;
      } catch {
        source = quotes;
      }
      if (active) {
        setItems(applyQuoteOverrides(source).map((quote) => ({ ...quote, history: baseHistory(quote), ...overrides[quote.id] })));
        setHydrated(true);
      }
    }
    void hydrateQuotes();
    return () => {
      active = false;
    };
  }, [quotes]);

  function patchQuote(quoteId: string, update: Partial<QuoteState>) {
    setItems((current) => current.map((quote) => quote.id === quoteId ? { ...quote, ...update } : quote));
    writeOverride(quoteId, update);
  }

  async function accept(quote: QuoteState) {
    setLoadingId(`${quote.id}-accept`);
    const response = await fetch(`/api/quotes/${quote.id}/accept`, { method: "POST" });
    const payload = await response.json() as { success: boolean; error?: string; data?: { orderId?: string } };
    setLoadingId("");
    if (!payload.success) {
      toast.error(payload.error ?? "Quote acceptance failed");
      return;
    }
    const history = [...quote.history, { id: `${quote.id}-accepted`, label: "Buyer accepted", body: `Order ${payload.data?.orderId ?? "created"} opened with escrow required.`, createdAt: new Date().toISOString() }];
    patchQuote(quote.id, { status: "accepted", final_price_usd: quote.offered_price_usd, history });
    saveQuoteOverride(quote.id, { status: "accepted", final_price_usd: quote.offered_price_usd });
    const price = quote.offered_price_usd ?? quote.target_price_usd ?? 0;
    const orderId = payload.data?.orderId ?? `ord-buyer-${Date.now()}`;
    const now = new Date().toISOString();
    const order: Order = {
      id: orderId,
      buyer_id: quote.buyer_id,
      supplier_id: quote.supplier_id,
      product_id: quote.product_id,
      status: "confirmed",
      quantity: quote.quantity,
      unit: quote.unit,
      price_usd: price,
      total_usd: price * quote.quantity,
      currency: "USD",
      payment_method: "stripe",
      escrow_status: "funded",
      tracking_number: null,
      notes: `Buyer accepted quote ${quote.id}. Escrow funded for admin release workflow.`,
      created_at: now,
      updated_at: now,
    };
    saveCreatedOrder(order);
    saveCreatedEscrow({
      id: `esc-${orderId}`,
      order_id: orderId,
      amount_usd: order.total_usd,
      currency: "USD",
      status: "funded",
      stripe_payment_intent: `pi_mock_${orderId}`,
      funded_at: now,
      released_at: null,
      dispute_reason: null,
      created_at: now,
    });
    toast.success("Quote accepted and order created");
  }

  async function sendCounter(quote: QuoteState) {
    const price = Number(counter.price);
    if (!price || Number.isNaN(price)) return toast.error("Counter price must be numeric");
    if (!counter.leadTime.trim()) return toast.error("Lead time is required");
    setLoadingId(`${quote.id}-counter`);
    const response = await fetch(`/api/quotes/${quote.id}/counter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ counterPrice: price, leadTime: counter.leadTime, note: counter.note }),
    });
    const payload = await response.json() as { success: boolean; error?: string; data?: { newQuoteId?: string } };
    setLoadingId("");
    if (!payload.success) {
      toast.error(payload.error ?? "Counter-offer failed");
      return;
    }
    const history = [...quote.history, { id: payload.data?.newQuoteId ?? `${quote.id}-counter`, label: "Buyer counter", body: `$${price} requested, ${counter.leadTime}. ${counter.note}`.trim(), createdAt: new Date().toISOString() }];
    patchQuote(quote.id, { status: "countered", target_price_usd: price, lead_time_requested: counter.leadTime, history });
    setCounterId("");
    setCounter({ price: "", leadTime: "", note: "" });
    toast.success("Counter-offer sent");
  }

  async function reject(quote: QuoteState) {
    setLoadingId(`${quote.id}-reject`);
    const response = await fetch("/api/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quoteId: quote.id, action: "reject" }),
    });
    const payload = await response.json() as { success: boolean; error?: string };
    setLoadingId("");
    if (!payload.success) {
      toast.error(payload.error ?? "Quote rejection failed");
      return;
    }
    const history = [...quote.history, { id: `${quote.id}-rejected`, label: "Buyer rejected", body: "Quote rejected by buyer.", createdAt: new Date().toISOString() }];
    patchQuote(quote.id, { status: "rejected", history });
    setRejectId("");
    toast.success("Quote rejected");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(26,26,24,0.12)] pb-6">
        <div>
          <p className="badge-patch">Structured Negotiation</p>
          <h1 className="mt-4 text-4xl">Quotes</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#5a5a54]">Accept, counter, or reject supplier quotes. Each action updates the visible negotiation chain before Supabase persistence is connected.</p>
        </div>
        <Link className="btn-pill btn-pill-outline min-h-[44px]" href="/buyer/inquiries">Back to Inquiries</Link>
      </div>

      {inquiryId && <div className="mt-6 border border-[#2d4a3e] bg-[#e8f0ec] p-4 text-sm">Quote handoff from inquiry <span className="metric-numeral">{inquiryId}</span>.</div>}

      <div className="mt-6 space-y-4">
        {!hydrated && <section className="border border-dashed p-5 text-sm text-[#5a5a54]">Loading quote desk...</section>}
        {hydrated && visibleItems.length === 0 && <section className="border border-dashed p-5 text-sm text-[#5a5a54]">No quotes found yet.</section>}
        {visibleItems.map((quote) => (
          <section className="border p-5" key={quote.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="badge-patch" suppressHydrationWarning>{quote.status}</p>
                <h2 className="mt-3 text-2xl">{quote.id}</h2>
                <p className="mt-1 text-sm text-[#5a5a54]">{quote.quantity.toLocaleString()} {quote.unit} / offered ${quote.offered_price_usd ?? "pending"} / {quote.lead_time_offered ?? "lead time pending"}</p>
              </div>
              <p className="metric-numeral text-3xl">${quote.final_price_usd ?? quote.offered_price_usd ?? quote.target_price_usd}</p>
            </div>

            <div className="mt-5 border p-4">
              <h3 className="text-xl">Negotiation History</h3>
              <div className="mt-3 space-y-3">
                {quote.history.map((item) => (
                  <div className="border-l-2 border-[#2d4a3e] pl-4" key={item.id}>
                    <p className="text-xs uppercase tracking-[0.14em] text-[#8a8a82]">{item.label}</p>
                    <p className="text-sm">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-pill btn-pill-forest min-h-[44px]" disabled={loadingId === `${quote.id}-accept` || quote.status === "accepted"} onClick={() => accept(quote)}>{quote.status === "accepted" ? "Accepted" : loadingId === `${quote.id}-accept` ? "Accepting..." : "Accept"}</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" disabled={quote.status === "accepted"} onClick={() => { setRejectId(""); setCounterId(counterId === quote.id ? "" : quote.id); }}>Counter</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" disabled={quote.status === "accepted" || quote.status === "rejected"} onClick={() => setRejectId(rejectId === quote.id ? "" : quote.id)}>Reject</button>
            </div>

            {counterId === quote.id && (
              <form className="mt-4 grid gap-3 md:grid-cols-4" onSubmit={(event) => { event.preventDefault(); void sendCounter(quote); }}>
                <input className="input-editorial" inputMode="decimal" placeholder="Counter price" value={counter.price} onChange={(event) => setCounter((value) => ({ ...value, price: event.target.value }))} />
                <input className="input-editorial" placeholder="Lead time" value={counter.leadTime} onChange={(event) => setCounter((value) => ({ ...value, leadTime: event.target.value }))} />
                <input className="input-editorial" placeholder="Counter note" value={counter.note} onChange={(event) => setCounter((value) => ({ ...value, note: event.target.value }))} />
                <button
                  className="btn-pill btn-pill-forest min-h-[44px]"
                  disabled={loadingId === `${quote.id}-counter`}
                  type="button"
                  onClick={() => void sendCounter(quote)}
                >
                  {loadingId === `${quote.id}-counter` ? "Sending..." : "Send Counter"}
                </button>
              </form>
            )}

            {rejectId === quote.id && (
              <div className="mt-4 border border-[#c0623a] p-4">
                <p className="text-sm text-[#5a5a54]">Reject this quote? This keeps the negotiation history visible and marks the quote as rejected.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setRejectId("")}>Keep Quote</button>
                  <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => void reject(quote)} disabled={loadingId === `${quote.id}-reject`}>{loadingId === `${quote.id}-reject` ? "Rejecting..." : "Confirm Reject"}</button>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
