"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { readSellerInquiries, saveSellerInquiries } from "@/app/components/shared/sellerMockStore";
import type { Inquiry } from "@/lib/mock-data";

export default function SellerInquiriesClient({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState(inquiries);
  const initialSelected = useMemo(() => {
    const requested = searchParams.get("inquiry");
    return items.some((item) => item.id === requested) ? requested ?? "" : items[0]?.id ?? "";
  }, [items, searchParams]);
  const [selected, setSelected] = useState(initialSelected);
  const [reply, setReply] = useState("");
  const current = items.find((item) => item.id === selected);
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      let stored = readSellerInquiries(inquiries);
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
    router.replace(`/seller/inquiries?inquiry=${id}`, { scroll: false });
    const nextItems = items.map((item) => item.id === id ? { ...item, status: item.status === "unread" ? "read" as const : item.status } : item);
    setItems(nextItems);
    saveSellerInquiries(nextItems);
    void fetch("/api/contact-supplier", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryId: id, status: "read" }),
    });
  }
  async function sendReply() {
    if (!reply.trim() || !current) {
      toast.error("Reply cannot be empty");
      return;
    }
    const response = await fetch("/api/contact-supplier", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryId: current.id, replyAuthor: "seller", replyBody: reply.trim() }),
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
      replies: [...item.replies, { id: `rep-${Date.now()}`, author: "seller" as const, body: reply.trim(), created_at: new Date().toISOString() }],
    } : item);
    setItems(nextItems);
    saveSellerInquiries(nextItems);
    setReply("");
    toast.success("Reply sent");
  }
  const unread = items.filter((item) => item.status === "unread").length;
  return (
    <div>
      <h1 className="text-4xl">Inquiries <span className="metric-numeral text-xl" suppressHydrationWarning>({unread} unread)</span></h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-2">{items.map((item) => <button className={`block min-h-[44px] w-full border p-3 text-start ${item.id === selected ? "border-[#2d4a3e] bg-[#e8f0ec]" : ""}`} key={item.id} onClick={() => open(item.id)}>{item.subject}<br /><span className="text-sm text-[#5a5a54]">{item.buyer_company}</span></button>)}</aside>
        {current && <section className="border p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-2xl">{current.subject}</h2><p className="mt-2 text-sm text-[#5a5a54]">{current.buyer_company} / intent {current.intent_score} / quantity {current.quantity.toLocaleString()}</p></div><span className="badge-patch" suppressHydrationWarning>{current.status}</span></div><p className="mt-3">{current.message}</p>{current.replies.length > 0 && <div className="mt-5 space-y-2 border p-4">{current.replies.map((message) => <div key={message.id}><p className="text-xs uppercase tracking-[0.14em] text-[#8a8a82]">{message.author}</p><p className="text-sm">{message.body}</p></div>)}</div>}<textarea className="input-editorial mt-5 min-h-[120px]" value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply" /><div className="mt-4 flex gap-3"><button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => void sendReply()}>Send Reply</button><Link className="btn-pill btn-pill-outline min-h-[44px]" href={`/seller/quotes?inquiry=${current.id}`}>Send Quote</Link></div></section>}
      </div>
    </div>
  );
}
