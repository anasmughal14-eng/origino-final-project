"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type TourStatus = "requested" | "scheduled" | "completed" | "cancelled";

type Tour = {
  id: string;
  buyer: string;
  country: string;
  requestedFor: string;
  status: TourStatus;
  roomUrl: string;
};

const initialTours: Tour[] = [
  {
    id: "tour-1",
    buyer: "Hansa Medical Imports",
    country: "Germany",
    requestedFor: "2026-05-08T15:00",
    status: "requested",
    roomUrl: "https://daily.co/origino-sialkot-demo",
  },
  {
    id: "tour-2",
    buyer: "Marina Trading LLC",
    country: "UAE",
    requestedFor: "2026-05-12T13:30",
    status: "scheduled",
    roomUrl: "https://daily.co/origino-textile-demo",
  },
];

export default function SellerVirtualToursPage() {
  const [tours, setTours] = useState(initialTours);
  const [buyer, setBuyer] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [videoFile, setVideoFile] = useState("");

  function updateTour(id: string, status: TourStatus) {
    setTours((current) => current.map((tour) => (tour.id === id ? { ...tour, status } : tour)));
    toast.success(`Tour ${status}.`);
  }

  function scheduleTour() {
    if (!buyer.trim() || !dateTime) {
      toast.error("Buyer and date/time are required.");
      return;
    }
    setTours((current) => [
      {
        id: `tour-${current.length + 1}`,
        buyer: buyer.trim(),
        country: "Buyer market",
        requestedFor: dateTime,
        status: "scheduled",
        roomUrl: "https://daily.co/origino-new-tour",
      },
      ...current,
    ]);
    setBuyer("");
    setDateTime("");
    toast.success("Virtual tour scheduled.");
  }

  function copyRoom(url: string) {
    navigator.clipboard?.writeText(url).catch(() => undefined);
    toast.success("Daily room link copied.");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Daily.co factory tours</span>
          <h1>Virtual Tours</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Schedule live buyer walkthroughs, manage room links, and keep pre-recorded factory tours ready for review.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="border p-5">
          <h2 className="text-2xl">Schedule Tour</h2>
          <label className="mt-5 block text-xs uppercase tracking-[0.24em] text-ink-muted">Buyer</label>
          <input className="input-editorial mt-2" value={buyer} onChange={(event) => setBuyer(event.target.value)} />
          <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-ink-muted">Date and time</label>
          <input
            className="input-editorial mt-2"
            type="datetime-local"
            value={dateTime}
            onChange={(event) => setDateTime(event.target.value)}
          />
          <button className="btn-pill btn-pill-forest mt-5" type="button" onClick={scheduleTour}>
            Schedule Tour
          </button>
        </div>

        <div className="border p-5">
          <h2 className="text-2xl">Pre-recorded Factory Tour</h2>
          <p className="mt-3 text-ink-soft">Upload a 5-10 minute factory tour for buyers who cannot attend live.</p>
          <input
            className="input-editorial mt-5"
            type="file"
            accept="video/mp4,video/webm"
            onChange={(event) => setVideoFile(event.target.files?.[0]?.name ?? "")}
          />
          {videoFile ? <p className="mt-3 text-sm text-forest">Selected: {videoFile}</p> : null}
          <button
            className="btn-pill btn-pill-outline mt-4"
            type="button"
            onClick={() => (videoFile ? toast.success("Factory tour queued for upload.") : toast.error("Choose a video first."))}
          >
            Save Video
          </button>
        </div>
      </section>

      <section className="border">
        <div className="border-b bg-cream p-4">
          <h2 className="text-2xl">Tour Requests</h2>
        </div>
        <div className="divide-y">
          {tours.map((tour) => (
            <div className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]" key={tour.id}>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl">{tour.buyer}</h3>
                  <span className="badge-patch">{tour.status}</span>
                </div>
                <p className="mt-2 text-ink-soft">
                  {tour.country} / {new Date(tour.requestedFor).toLocaleString()}
                </p>
                <p className="mt-2 text-sm">{tour.roomUrl}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => copyRoom(tour.roomUrl)}>
                  Copy Link
                </button>
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => window.open(tour.roomUrl, "_blank")}>
                  Join
                </button>
                <button className="btn-pill btn-pill-forest" type="button" onClick={() => updateTour(tour.id, "scheduled")}>
                  Confirm
                </button>
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => updateTour(tour.id, "completed")}>
                  Complete
                </button>
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => updateTour(tour.id, "cancelled")}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
