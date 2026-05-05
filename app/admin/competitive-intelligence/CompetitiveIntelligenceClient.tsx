"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type IntelligenceRecord = {
  id: string;
  category: string;
  market: string;
  averagePrice: string;
  range: string;
  moq: string;
  leadTime: string;
  sampleSize: number;
  status: string;
};

export default function CompetitiveIntelligenceClient({ records }: { records: IntelligenceRecord[] }) {
  const [items, setItems] = useState(records);
  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Not refreshed in this session");

  const visibleItems = useMemo(
    () => items.filter((item) => `${item.category} ${item.market} ${item.status}`.toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  async function refreshMarketData() {
    setRefreshing(true);
    try {
      const response = await fetch("/api/admin/competitive-intelligence", { method: "POST" });
      const result = (await response.json()) as { success: boolean; data?: { message?: string }; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error ?? "Unable to refresh intelligence.");
      setItems((current) => current.map((item) => ({ ...item, status: "active" })));
      setLastUpdated(new Date().toLocaleString());
      toast.success(result.data?.message ?? "Competitive intelligence refreshed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to refresh intelligence.");
    } finally {
      setRefreshing(false);
    }
  }

  function exportReport() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "competitive-intelligence.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Benchmark report exported.");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Price benchmarking</span>
          <h1>Competitive Intelligence</h1>
          <p className="mt-3 max-w-3xl text-ink-soft">
            Review anonymised quote and order benchmarks by category and target market. The weekly cron route updates averages, price ranges, MOQs, lead times, and admin market-shift notes.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-pill btn-pill-outline" type="button" onClick={exportReport}>
            Export Report
          </button>
          <button className="btn-pill btn-pill-forest" type="button" onClick={refreshMarketData} disabled={refreshing}>
            {refreshing ? "Refreshing..." : "Run Update"}
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="border p-5">
          <p className="metric-text text-3xl">{items.length}</p>
          <p className="mt-2 text-ink-soft">Benchmarks</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">{items.reduce((total, item) => total + item.sampleSize, 0)}</p>
          <p className="mt-2 text-ink-soft">Quote/order samples</p>
        </div>
        <div className="border p-5 md:col-span-2">
          <p className="metric-text text-xl">{lastUpdated}</p>
          <p className="mt-2 text-ink-soft">Last admin refresh</p>
        </div>
      </section>

      <input className="input-editorial min-h-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search category or market" />

      <section className="overflow-x-auto border">
        <table className="min-w-full text-sm">
          <thead className="bg-cream text-left">
            <tr>
              <th className="p-4">Category</th>
              <th className="p-4">Market</th>
              <th className="p-4">Avg Price</th>
              <th className="p-4">Range</th>
              <th className="p-4">MOQ</th>
              <th className="p-4">Lead Time</th>
              <th className="p-4">Samples</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item) => (
              <tr className="border-t" key={item.id}>
                <td className="p-4 font-semibold">{item.category}</td>
                <td className="p-4">{item.market}</td>
                <td className="metric-text p-4">{item.averagePrice}</td>
                <td className="p-4">{item.range}</td>
                <td className="p-4">{item.moq}</td>
                <td className="p-4">{item.leadTime}</td>
                <td className="metric-text p-4">{item.sampleSize}</td>
                <td className="p-4">
                  <span className="badge-patch">{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
