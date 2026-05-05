"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const countryRows = [
  { country: "Germany", visitors: 420, inquiries: 6, share: "34%" },
  { country: "United Arab Emirates", visitors: 310, inquiries: 4, share: "25%" },
  { country: "United Kingdom", visitors: 210, inquiries: 3, share: "17%" },
  { country: "Saudi Arabia", visitors: 180, inquiries: 2, share: "15%" },
  { country: "United States", visitors: 120, inquiries: 1, share: "9%" },
];

const searchTerms = [
  { term: "CE surgical scissors Pakistan", views: 188, clicks: 42 },
  { term: "Sialkot dental instruments ISO 13485", views: 146, clicks: 31 },
  { term: "reusable forceps supplier", views: 112, clicks: 26 },
  { term: "OEM surgical kit manufacturer", views: 96, clicks: 18 },
];

const funnel = [
  { label: "Profile views", value: 1240 },
  { label: "Product opens", value: 410 },
  { label: "Inquiries", value: 18 },
  { label: "Quotes", value: 7 },
  { label: "Orders", value: 2 },
];

export default function SellerAnalyticsPage() {
  const [range, setRange] = useState("30");
  const [note, setNote] = useState("");
  const [savedNote, setSavedNote] = useState("Benchmark: response time remains faster than platform average.");

  const metrics = useMemo(
    () => [
      { label: "Visitor countries", value: countryRows.length.toString() },
      { label: "Profile views", value: range === "90" ? "3,420" : "1,240" },
      { label: "Search clicks", value: range === "90" ? "318" : "117" },
      { label: "Inquiry conversion", value: range === "90" ? "1.7%" : "1.5%" },
    ],
    [range],
  );

  function saveNote() {
    if (!note.trim()) {
      toast.error("Add a benchmark note before saving.");
      return;
    }
    setSavedNote(note.trim());
    setNote("");
    toast.success("Analytics note saved.");
  }

  function exportReport() {
    toast.success("Analytics export prepared for Supabase handoff.");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Seller analytics</span>
          <h1>Analytics</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Profile visitor countries, search terms, conversion funnel, and competitor benchmark signals.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="input-editorial min-h-11" value={range} onChange={(event) => setRange(event.target.value)}>
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button className="btn-pill btn-pill-outline" type="button" onClick={exportReport}>
            Export Report
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div className="border p-5" key={metric.label}>
            <p className="metric-text text-2xl">{metric.value}</p>
            <p className="mt-2 text-ink-soft">{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border">
          <div className="border-b bg-cream p-4">
            <h2 className="text-2xl">Buyer Countries</h2>
          </div>
          <div className="divide-y">
            {countryRows.map((row) => (
              <div className="grid gap-3 p-4 md:grid-cols-4" key={row.country}>
                <strong>{row.country}</strong>
                <span>{row.visitors} visitors</span>
                <span>{row.inquiries} inquiries</span>
                <span className="metric-text">{row.share}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border p-5">
          <h2 className="text-2xl">Conversion Funnel</h2>
          <div className="mt-5 space-y-4">
            {funnel.map((step, index) => (
              <div key={step.label}>
                <div className="mb-2 flex justify-between gap-4">
                  <span>{step.label}</span>
                  <span className="metric-text">{step.value.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-border">
                  <div className="h-2 bg-forest" style={{ width: `${Math.max(8, 100 - index * 20)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="border">
          <div className="border-b bg-cream p-4">
            <h2 className="text-2xl">Search Terms</h2>
          </div>
          <div className="divide-y">
            {searchTerms.map((row) => (
              <div className="grid gap-3 p-4 md:grid-cols-[1fr_auto_auto]" key={row.term}>
                <strong>{row.term}</strong>
                <span>{row.views} views</span>
                <span>{row.clicks} clicks</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border p-5">
          <h2 className="text-2xl">Competitor Benchmark</h2>
          <p className="mt-3 text-ink-soft">{savedNote}</p>
          <textarea
            className="input-editorial mt-5 min-h-28"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add benchmark note"
          />
          <button className="btn-pill btn-pill-forest mt-4" type="button" onClick={saveNote}>
            Save Benchmark Note
          </button>
        </div>
      </section>
    </div>
  );
}
