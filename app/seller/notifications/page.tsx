"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type NotificationType = "inquiry" | "quote" | "document" | "health" | "order";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "inquiry",
    title: "New buyer inquiry",
    body: "Hansa Medical Imports requested CE forceps pricing.",
    read: false,
    createdAt: "2026-05-04 10:12",
  },
  {
    id: "notif-2",
    type: "document",
    title: "ISO document expiry",
    body: "ISO 13485 certificate expires in 30 days.",
    read: false,
    createdAt: "2026-05-03 16:30",
  },
  {
    id: "notif-3",
    type: "quote",
    title: "Quote accepted",
    body: "Marina Trading LLC accepted quote QT-1024.",
    read: true,
    createdAt: "2026-05-02 11:20",
  },
  {
    id: "notif-4",
    type: "health",
    title: "Health score check",
    body: "Response speed remains above benchmark.",
    read: true,
    createdAt: "2026-05-01 09:00",
  },
];

export default function SellerNotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | NotificationType>("all");

  const visible = useMemo(
    () =>
      notifications.filter((notification) => {
        if (filter === "all") return true;
        if (filter === "unread") return !notification.read;
        return notification.type === filter;
      }),
    [filter, notifications],
  );

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  function markRead(id: string) {
    setNotifications((current) => current.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)));
    toast.success("Notification marked read.");
  }

  function markAllRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    toast.success("All notifications marked read.");
  }

  function clearRead() {
    setNotifications((current) => current.filter((notification) => !notification.read));
    toast.success("Read notifications cleared.");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Notification center</span>
          <h1>Notifications</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Inquiry, quote, document, health score, and order milestone alerts for the seller workspace.
          </p>
        </div>
        <div className="text-right">
          <p className="metric-text text-3xl">{unreadCount}</p>
          <p className="text-sm uppercase tracking-[0.18em] text-ink-muted">Unread</p>
        </div>
      </section>

      <section className="flex flex-wrap gap-3">
        <select className="input-editorial min-h-11 max-w-xs" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
          <option value="all">All notifications</option>
          <option value="unread">Unread only</option>
          <option value="inquiry">Inquiries</option>
          <option value="quote">Quotes</option>
          <option value="document">Documents</option>
          <option value="health">Health score</option>
          <option value="order">Orders</option>
        </select>
        <button className="btn-pill btn-pill-outline" type="button" onClick={markAllRead}>
          Mark All Read
        </button>
        <button className="btn-pill btn-pill-outline" type="button" onClick={clearRead}>
          Clear Read
        </button>
      </section>

      <section className="space-y-4">
        {visible.length ? (
          visible.map((notification) => (
            <div className="border p-5" key={notification.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="badge-patch">{notification.type}</span>
                    {!notification.read ? <span className="badge-patch">unread</span> : null}
                  </div>
                  <h2 className="mt-3 text-2xl">{notification.title}</h2>
                  <p className="mt-2 text-ink-soft">{notification.body}</p>
                  <p className="mt-2 text-sm text-ink-muted">{notification.createdAt}</p>
                </div>
                <button className="btn-pill btn-pill-forest" type="button" onClick={() => markRead(notification.id)} disabled={notification.read}>
                  {notification.read ? "Read" : "Mark Read"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="border p-8 text-center text-ink-muted">No notifications match this filter.</div>
        )}
      </section>
    </div>
  );
}
