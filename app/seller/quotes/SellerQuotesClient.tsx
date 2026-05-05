"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { applyQuoteOverrides, saveCreatedEscrow, saveCreatedOrder, saveCreatedQuote, saveQuoteOverride } from "@/app/components/shared/sellerMockStore";
import type { Quote } from "@/types/database";

type CreateQuoteForm = {
  quantity: string;
  offeredPrice: string;
  leadTime: string;
  notes: string;
};

export default function SellerQuotesClient({ quotes }: { quotes: Quote[] }) {
  const searchParams = useSearchParams();
  const inquiryId = searchParams.get("inquiry");
  const [items, setItems] = useState(quotes);
  const [counterId, setCounterId] = useState("");
  const [confirmDeclineId, setConfirmDeclineId] = useState("");
  const [counter, setCounter] = useState({ price: "", leadTime: "" });
  const [loadingId, setLoadingId] = useState("");
  const [createForm, setCreateForm] = useState<CreateQuoteForm>({ quantity: "500", offeredPrice: "12.5", leadTime: "30 days", notes: "Formal quote created from seller inquiry desk." });

  useEffect(() => {
    let active = true;
    async function hydrateQuotes() {
      let source = quotes;
      try {
        const response = await fetch("/api/quotes");
        const payload = await response.json() as { success: boolean; data?: Quote[] };
        if (payload.success && Array.isArray(payload.data)) source = payload.data;
      } catch {
        source = quotes;
      }
      if (active) setItems(applyQuoteOverrides(source));
    }
    void hydrateQuotes();
    return () => {
      active = false;
    };
  }, [quotes]);

  async function createQuote() {
    const quantity = Number(createForm.quantity);
    const price = Number(createForm.offeredPrice);
    if (!quantity || Number.isNaN(quantity)) return toast.error("Quantity must be numeric");
    if (!price || Number.isNaN(price)) return toast.error("Offered price must be numeric");
    if (!createForm.leadTime.trim()) return toast.error("Lead time is required");

    setLoadingId("create");
    const template = items[0] ?? quotes[0];
    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: template?.supplier_id ?? "sup-1",
        buyerId: template?.buyer_id ?? "buyer-1",
        productId: template?.product_id ?? "prod-1",
        quantity,
        offeredPriceUsd: price,
        leadTimeOffered: createForm.leadTime,
        inquiryId,
        notes: createForm.notes,
      }),
    });
    const json = (await response.json()) as { success: boolean; error?: string; data?: { quoteId?: string; quote?: Quote } };
    setLoadingId("");
    if (!json.success || !template) {
      toast.error(json.error ?? "Quote creation failed");
      return;
    }
    const now = new Date().toISOString();
    const quote: Quote = json.data?.quote ?? {
      ...template,
      id: json.data?.quoteId ?? `quote-local-${Date.now()}`,
      status: "responded",
      quantity,
      offered_price_usd: price,
      final_price_usd: null,
      lead_time_offered: createForm.leadTime,
      notes: `${createForm.notes}${inquiryId ? ` Inquiry: ${inquiryId}.` : ""}`,
      created_at: now,
      updated_at: now,
    };
    saveCreatedQuote(quote);
    setItems((list) => [quote, ...list]);
    toast.success("Quote created and added to the quote desk");
  }

  async function act(quoteId: string, action: string) {
    if (action === "counter") {
      if (!counter.price || Number.isNaN(Number(counter.price))) return toast.error("Counter price must be numeric");
      if (!counter.leadTime.trim()) return toast.error("Lead time is required");
    }
    setLoadingId(`${quoteId}-${action}`);
    const endpoint = action === "accept" ? `/api/quotes/${quoteId}/accept` : action === "counter" ? `/api/quotes/${quoteId}/counter` : "/api/quotes";
    const response = await fetch(endpoint, {
      method: action === "decline" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        action === "counter"
          ? { counterPrice: Number(counter.price), leadTime: counter.leadTime }
          : { quoteId, action }
      ),
    });
    const json = (await response.json()) as { success: boolean; error?: string; data?: { orderId?: string } };
    if (!json.success) {
      setLoadingId("");
      toast.error(json.error ?? "Quote update failed");
      return;
    }
    const sourceQuote = items.find((quote) => quote.id === quoteId);
    const status = action === "accept" ? "accepted" : action === "counter" ? "countered" : "rejected";
    saveQuoteOverride(quoteId, {
      status,
      final_price_usd: action === "accept" ? sourceQuote?.offered_price_usd ?? null : undefined,
      lead_time_offered: action === "counter" ? counter.leadTime : undefined,
    });
    if (action === "accept" && sourceQuote) {
      const price = sourceQuote.offered_price_usd ?? sourceQuote.target_price_usd ?? 0;
      const orderId = json.data?.orderId ?? `ord-local-${Date.now()}`;
      const now = new Date().toISOString();
      saveCreatedOrder({
        id: orderId,
        buyer_id: sourceQuote.buyer_id,
        supplier_id: sourceQuote.supplier_id,
        product_id: sourceQuote.product_id,
        status: "confirmed",
        quantity: sourceQuote.quantity,
        unit: sourceQuote.unit,
        price_usd: price,
        total_usd: price * sourceQuote.quantity,
        currency: "USD",
        payment_method: "stripe",
        escrow_status: "funded",
        tracking_number: null,
        notes: `Created from accepted quote ${quoteId}.`,
        created_at: now,
        updated_at: now,
      });
      saveCreatedEscrow({
        id: `esc-${orderId}`,
        order_id: orderId,
        amount_usd: price * sourceQuote.quantity,
        currency: "USD",
        status: "funded",
        stripe_payment_intent: `pi_mock_${orderId}`,
        funded_at: now,
        released_at: null,
        dispute_reason: null,
        created_at: now,
      });
    }
    setItems((list) => list.map((quote) => quote.id === quoteId ? { ...quote, status } : quote));
    setLoadingId("");
    setConfirmDeclineId("");
    setCounterId("");
    setCounter({ price: "", leadTime: "" });
    toast.success(action === "accept" && json.data?.orderId ? `Quote accepted. Order ${json.data.orderId} created.` : "Quote updated");
  }

  return (
    <div>
      <div className="flex flex-col gap-2 border-b border-[rgba(26,26,24,0.12)] pb-6">
        <p className="badge-patch">Structured negotiation</p>
        <h1 className="text-4xl">Quotes</h1>
        <p className="max-w-3xl text-sm text-[#5a5a54]">Create, counter, accept, or decline formal quote records. Accepted quotes create local orders immediately.</p>
      </div>

      {inquiryId && (
        <section className="mt-6 border border-[#2d4a3e] bg-[#e8f0ec] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="badge-patch">Inquiry handoff</p>
              <h2 className="mt-3 text-2xl">Create quote for {inquiryId}</h2>
            </div>
            <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={createQuote} disabled={loadingId === "create"}>{loadingId === "create" ? "Creating..." : "Create Quote"}</button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <input className="input-editorial" inputMode="numeric" value={createForm.quantity} onChange={(event) => setCreateForm((value) => ({ ...value, quantity: event.target.value }))} placeholder="Quantity" />
            <input className="input-editorial" inputMode="decimal" value={createForm.offeredPrice} onChange={(event) => setCreateForm((value) => ({ ...value, offeredPrice: event.target.value }))} placeholder="Unit price" />
            <input className="input-editorial" value={createForm.leadTime} onChange={(event) => setCreateForm((value) => ({ ...value, leadTime: event.target.value }))} placeholder="Lead time" />
            <input className="input-editorial" value={createForm.notes} onChange={(event) => setCreateForm((value) => ({ ...value, notes: event.target.value }))} placeholder="Notes" />
          </div>
        </section>
      )}

      <div className="mt-6 space-y-3">
        {items.map((quote) => (
          <div className="border p-4" key={quote.id}>
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-semibold">{quote.id}</p>
                <p className="mt-1 text-sm text-[#5a5a54]">{quote.quantity.toLocaleString()} {quote.unit} / {quote.lead_time_offered ?? "lead time pending"}</p>
                <p className="badge-patch mt-2">{quote.status}</p>
              </div>
              <p className="metric-numeral">${quote.offered_price_usd}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => act(quote.id, "accept")} disabled={loadingId === `${quote.id}-accept`}>{loadingId === `${quote.id}-accept` ? "Accepting..." : "Accept"}</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => { setConfirmDeclineId(""); setCounterId(counterId === quote.id ? "" : quote.id); }}>Counter-offer</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setConfirmDeclineId(confirmDeclineId === quote.id ? "" : quote.id)}>Decline</button>
            </div>
            {counterId === quote.id && (
              <form className="mt-4 grid gap-3 md:grid-cols-3" onSubmit={(event) => { event.preventDefault(); void act(quote.id, "counter"); }}>
                <input className="input-editorial" placeholder="Counter price" value={counter.price} onChange={(event) => setCounter((value) => ({ ...value, price: event.target.value }))} inputMode="decimal" />
                <input className="input-editorial" placeholder="Lead time" value={counter.leadTime} onChange={(event) => setCounter((value) => ({ ...value, leadTime: event.target.value }))} />
                <button className="btn-pill btn-pill-forest min-h-[44px]" disabled={loadingId === `${quote.id}-counter`}>{loadingId === `${quote.id}-counter` ? "Sending..." : "Send Counter"}</button>
              </form>
            )}
            {confirmDeclineId === quote.id && (
              <div className="mt-4 border border-[#c0623a] p-4">
                <p className="text-sm text-[#5a5a54]">Decline this quote? This updates the visible status immediately.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setConfirmDeclineId("")}>Keep Quote</button>
                  <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => act(quote.id, "decline")} disabled={loadingId === `${quote.id}-decline`}>{loadingId === `${quote.id}-decline` ? "Declining..." : "Confirm Decline"}</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
