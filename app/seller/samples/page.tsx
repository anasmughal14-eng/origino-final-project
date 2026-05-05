"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type SampleStatus = "requested" | "quoted" | "shipped" | "delivered";

type SampleRequest = {
  id: string;
  buyer: string;
  product: string;
  quantity: string;
  status: SampleStatus;
  tracking?: string;
  note: string;
};

const initialRequests: SampleRequest[] = [
  {
    id: "sample-1",
    buyer: "Hansa Medical Imports",
    product: "German Pattern Surgical Scissors",
    quantity: "3 sets",
    status: "requested",
    note: "Needs CE documentation with the sample parcel.",
  },
  {
    id: "sample-2",
    buyer: "Marina Trading LLC",
    product: "Dental Extraction Forceps Set",
    quantity: "2 sets",
    status: "quoted",
    note: "Buyer accepted sample price, awaiting shipment.",
  },
];

export default function SellerSamplesPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState<"all" | SampleStatus>("all");
  const [tracking, setTracking] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const visibleRequests = useMemo(
    () => requests.filter((request) => filter === "all" || request.status === filter),
    [filter, requests],
  );

  function updateStatus(id: string, status: SampleStatus) {
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
    toast.success(`Sample marked ${status}.`);
  }

  function saveTracking() {
    if (!activeId || !tracking.trim()) {
      toast.error("Tracking number is required.");
      return;
    }
    setRequests((current) =>
      current.map((request) =>
        request.id === activeId ? { ...request, tracking: tracking.trim(), status: "shipped" } : request,
      ),
    );
    setTracking("");
    setActiveId(null);
    toast.success("Tracking saved and buyer notified.");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Sample flow</span>
          <h1>Samples</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Manage requested samples, quote sample dispatches, add tracking, and update buyer status.
          </p>
        </div>
        <select className="input-editorial min-h-11" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>
          <option value="all">All statuses</option>
          <option value="requested">Requested</option>
          <option value="quoted">Quoted</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </section>

      <section className="space-y-4">
        {visibleRequests.map((request) => (
          <div className="border p-5" key={request.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl">{request.product}</h2>
                  <span className="badge-patch">{request.status}</span>
                </div>
                <p className="mt-2 text-ink-soft">
                  {request.buyer} / {request.quantity}
                </p>
                <p className="mt-3">{request.note}</p>
                {request.tracking ? <p className="mt-2 metric-text">Tracking {request.tracking}</p> : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => updateStatus(request.id, "quoted")}>
                  Send Sample Quote
                </button>
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => setActiveId(request.id)}>
                  Add Tracking
                </button>
                <button className="btn-pill btn-pill-forest" type="button" onClick={() => updateStatus(request.id, "delivered")}>
                  Mark Delivered
                </button>
              </div>
            </div>
            {activeId === request.id ? (
              <div className="mt-5 border bg-warm-white p-4">
                <label className="block text-xs uppercase tracking-[0.24em] text-ink-muted">Tracking number</label>
                <div className="mt-2 flex flex-wrap gap-3">
                  <input className="input-editorial flex-1" value={tracking} onChange={(event) => setTracking(event.target.value)} />
                  <button className="btn-pill btn-pill-forest" type="button" onClick={saveTracking}>
                    Save Tracking
                  </button>
                  <button className="btn-pill btn-pill-outline" type="button" onClick={() => setActiveId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </section>
    </div>
  );
}
