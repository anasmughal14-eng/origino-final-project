"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BuyerNotificationsPage() {
  const [items, setItems] = useState([
    { id: "n-1", title: "New quote received", body: "Crescent Surgical Works replied to your CE forceps program.", link: "/buyer/quotes", read: false },
    { id: "n-2", title: "Inspection report ready", body: "Your PSI report for ord-1 is available.", link: "/buyer/inspections", read: false },
    { id: "n-3", title: "Saved search match", body: "Two Sialkot suppliers match your CE search.", link: "/marketplace", read: true },
  ]);

  function markRead(id: string) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
    toast.success("Notification marked read");
  }

  return (
    <div>
      <span className="badge-patch">BUYER ALERTS</span>
      <h1 className="mt-4 text-4xl">Notifications</h1>
      <p className="mt-3 text-[#5a5a54]">Quote, inspection, order, and saved-search alerts.</p>
      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <div className="flex flex-wrap items-center justify-between gap-4 border border-[#e2ddd8] p-5" key={item.id}>
            <div>
              <h2 className="text-2xl">{item.title}</h2>
              <p className="mt-1 text-sm text-[#5a5a54]">{item.body}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge-patch">{item.read ? "READ" : "UNREAD"}</span>
              <Link className="btn-pill btn-pill-outline" href={item.link}>Open</Link>
              <button className="btn-pill btn-pill-outline" disabled={item.read} onClick={() => markRead(item.id)}>Mark Read</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
