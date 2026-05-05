"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { readBuyerInquiries, saveBuyerInquiries, saveSharedInquiry } from "@/app/components/shared/sellerMockStore";
import type { Inquiry } from "@/lib/mock-data";

const supplierOptions = [
  { id: "sup-1", label: "Crescent Surgical Works", productId: "prod-1" },
  { id: "sup-2", label: "Nishat Weaves Faisalabad", productId: "prod-3" },
  { id: "sup-3", label: "Lahore Leather Company", productId: "prod-5" },
  { id: "sup-4", label: "Karachi Agro Foods", productId: "prod-7" },
  { id: "sup-5", label: "Gujranwala Tools & Cutlery", productId: "prod-10" },
];

export default function BuyerInquiriesClient({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState(inquiries);
  const initialSelected = useMemo(() => {
    const requested = searchParams.get("inquiry");
    return inquiries.some((item) => item.id === requested) ? requested ?? "" : inquiries[0]?.id ?? "";
  }, [inquiries, searchParams]);
  const [selected, setSelected] = useState(initialSelected);
  const [reply, setReply] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newInquiry, setNewInquiry] = useState({
    supplierId: "sup-1",
    subject: "",
    message: "",
    quantity: "",
  });
  const [creating, setCreating] = useState(false);
  const current = items.find((item) => item.id === selected);
  const unread = items.filter((item) => item.status === "unread").length;

  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      let stored = readBuyerInquiries(inquiries);
      try {
        const response = await fetch("/api/contact-supplier");
        const payload = await response.json() as { success: boolean; data?: Inquiry[] };
        if (payload.success && payload.data) stored = payload.data;
      } catch {
        // Keep local state if the runtime API is unavailable.
      }
      if (cancelled) return;
      setItems(stored);
      const requested = searchParams.get("inquiry");
      if (requested && stored.some((item) => item.id === requested)) {
        setSelected(requested);
      } else if (!stored.some((item) => item.id === selected)) {
        setSelected(stored[0]?.id ?? "");
      }
    }
    void hydrate();
    return () => { cancelled = true; };
  }, [inquiries, searchParams, selected]);

  function open(id: string) {
    setSelected(id);
    router.replace(`/buyer/inquiries?inquiry=${id}`, { scroll: false });
    const nextItems = items.map((item) => item.id === id ? { ...item, status: item.status === "unread" ? "read" as const : item.status } : item);
    setItems(nextItems);
    saveBuyerInquiries(nextItems);
    void fetch("/api/contact-supplier", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryId: id, status: "read" }),
    });
  }

  async function sendReply() {
    if (!current || !reply.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    const response = await fetch("/api/contact-supplier", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryId: current.id, replyAuthor: "buyer", replyBody: reply.trim() }),
    });
    const payload = await response.json() as { success: boolean; data?: { inquiry?: Inquiry }; error?: string };
    if (!payload.success) {
      toast.error(payload.error ?? "Reply could not be sent");
      return;
    }
    const updated = payload.data?.inquiry;
    const nextItems = items.map((item) => item.id === current.id ? updated ?? {
      ...item,
      status: "replied" as const,
      replies: [...item.replies, { id: `buyer-rep-${Date.now()}`, author: "buyer" as const, body: reply.trim(), created_at: new Date().toISOString() }],
    } : item);
    setItems(nextItems);
    saveBuyerInquiries(nextItems);
    setReply("");
    toast.success("Reply sent to supplier");
  }

  async function createInquiry() {
    const supplier = supplierOptions.find((item) => item.id === newInquiry.supplierId) ?? supplierOptions[0];
    const quantity = Number(newInquiry.quantity);
    if (!newInquiry.subject.trim()) return toast.error("Subject is required");
    if (!newInquiry.message.trim()) return toast.error("Message is required");
    if (!quantity || Number.isNaN(quantity)) return toast.error("Quantity must be numeric");

    setCreating(true);
    const response = await fetch("/api/contact-supplier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: supplier.id,
        productId: supplier.productId,
        subject: newInquiry.subject,
        name: "Marta Klein",
        company: "Hansa Medical Imports",
        email: "buyer@example.com",
        message: newInquiry.message,
        quantity,
      }),
    });
    const payload = await response.json() as { success: boolean; error?: string; data?: { inquiryId?: string; intentScore?: number; inquiry?: Inquiry } };
    setCreating(false);
    if (!payload.success) {
      toast.error(payload.error ?? "Inquiry could not be sent");
      return;
    }
    const now = new Date().toISOString();
    const inquiry: Inquiry = payload.data?.inquiry ?? {
      id: payload.data?.inquiryId ?? `inq-local-${Date.now()}`,
      supplier_id: supplier.id,
      buyer_id: "buyer-1",
      buyer_name: "Marta Klein",
      buyer_company: "Hansa Medical Imports",
      subject: newInquiry.subject.trim(),
      message: newInquiry.message.trim(),
      quantity,
      product_id: supplier.productId,
      status: "unread",
      intent_score: payload.data?.intentScore ?? 82,
      created_at: now,
      replies: [],
    };
    const nextItems = [inquiry, ...items];
    saveSharedInquiry(inquiry);
    setItems(nextItems);
    setSelected(inquiry.id);
    setShowNew(false);
    setNewInquiry({ supplierId: "sup-1", subject: "", message: "", quantity: "" });
    router.replace(`/buyer/inquiries?inquiry=${inquiry.id}`, { scroll: false });
    toast.success("Inquiry sent to supplier inbox");
  }

  function requestQuote() {
    if (!current) return;
    router.push(`/buyer/quotes?inquiry=${current.id}`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgba(26,26,24,0.12)] pb-6">
        <div>
          <p className="badge-patch">Correspondence Desk</p>
          <h1 className="mt-4 text-4xl">Inquiries <span className="metric-numeral text-xl" suppressHydrationWarning>({unread} unread)</span></h1>
          <p className="mt-2 text-sm text-[#5a5a54]">Review supplier replies, continue threads, and turn serious conversations into quote negotiations.</p>
        </div>
        <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => setShowNew((value) => !value)}>{showNew ? "Close Form" : "New Inquiry"}</button>
      </div>

      {showNew && (
        <section className="mt-6 border border-[#2d4a3e] bg-[#e8f0ec] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="badge-patch">Buyer to Supplier</p>
              <h2 className="mt-3 text-2xl">Send a New Inquiry</h2>
              <p className="mt-1 text-sm text-[#5a5a54]">This creates the same mock inquiry record in buyer and seller portals.</p>
            </div>
            <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => router.push("/marketplace")}>Browse Marketplace</button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label>
              <span className="small-caps text-xs">Supplier</span>
              <select className="input-editorial mt-1" value={newInquiry.supplierId} onChange={(event) => setNewInquiry((value) => ({ ...value, supplierId: event.target.value }))}>
                {supplierOptions.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.label}</option>)}
              </select>
            </label>
            <label>
              <span className="small-caps text-xs">Quantity</span>
              <input className="input-editorial mt-1" inputMode="numeric" value={newInquiry.quantity} onChange={(event) => setNewInquiry((value) => ({ ...value, quantity: event.target.value }))} placeholder="500" />
            </label>
            <label>
              <span className="small-caps text-xs">Subject</span>
              <input className="input-editorial mt-1" value={newInquiry.subject} onChange={(event) => setNewInquiry((value) => ({ ...value, subject: event.target.value }))} placeholder="CE forceps sample order" />
            </label>
            <label className="md:col-span-2">
              <span className="small-caps text-xs">Message</span>
              <textarea className="input-editorial mt-1 min-h-[120px]" value={newInquiry.message} onChange={(event) => setNewInquiry((value) => ({ ...value, message: event.target.value }))} placeholder="Tell the supplier what you need, target market, and packaging requirements." />
            </label>
          </div>
          <button className="btn-pill btn-pill-forest mt-4 min-h-[44px]" disabled={creating} onClick={() => void createInquiry()}>{creating ? "Sending..." : "Send Inquiry"}</button>
        </section>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-2">
          {items.map((item) => (
            <button className={`block min-h-[44px] w-full border p-3 text-start ${item.id === selected ? "border-[#2d4a3e] bg-[#e8f0ec]" : ""}`} key={item.id} onClick={() => open(item.id)}>
              <span className="font-semibold">{item.subject}</span>
              <br />
              <span className="text-sm text-[#5a5a54]">{item.buyer_company} / intent {item.intent_score}</span>
            </button>
          ))}
        </aside>

        {current ? (
          <section className="border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl">{current.subject}</h2>
                <p className="mt-2 text-sm text-[#5a5a54]">Quantity {current.quantity.toLocaleString()} / inquiry {current.id}</p>
              </div>
              <span className="badge-patch" suppressHydrationWarning>{current.status}</span>
            </div>
            <p className="mt-4">{current.message}</p>
            <div className="mt-5 space-y-2 border p-4">
              {current.replies.length === 0 ? <p className="text-sm text-[#5a5a54]">No supplier reply yet.</p> : current.replies.map((message) => (
                <div key={message.id}>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#8a8a82]">{message.author}</p>
                  <p className="text-sm">{message.body}</p>
                </div>
              ))}
            </div>
            <textarea className="input-editorial mt-5 min-h-[120px]" value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply" />
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => void sendReply()}>Send Reply</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={requestQuote}>Request Quote</button>
            </div>
          </section>
        ) : (
          <section className="border border-dashed p-5 text-sm text-[#5a5a54]">No inquiries found.</section>
        )}
      </div>
    </div>
  );
}
