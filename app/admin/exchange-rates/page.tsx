"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type RateRow = {
  currency: string;
  rate: string;
  override: boolean;
  updatedAt: string;
};

const initialRates: RateRow[] = [
  { currency: "PKR", rate: "278.50", override: false, updatedAt: "2026-05-04 06:00" },
  { currency: "EUR", rate: "0.92", override: false, updatedAt: "2026-05-04 06:00" },
  { currency: "GBP", rate: "0.79", override: false, updatedAt: "2026-05-04 06:00" },
  { currency: "AED", rate: "3.67", override: false, updatedAt: "2026-05-04 06:00" },
];

export default function AdminExchangeRatesPage() {
  const [rates, setRates] = useState(initialRates);

  function updateRate(currency: string, value: string) {
    setRates((current) => current.map((rate) => (rate.currency === currency ? { ...rate, rate: value, override: true } : rate)));
  }

  function toggleOverride(currency: string) {
    setRates((current) => current.map((rate) => (rate.currency === currency ? { ...rate, override: !rate.override } : rate)));
    toast.success("Override setting updated.");
  }

  function refreshRates() {
    setRates((current) =>
      current.map((rate) => ({
        ...rate,
        updatedAt: new Date().toLocaleString(),
      })),
    );
    toast.success("Exchange rates refreshed.");
  }

  function saveRates() {
    const invalid = rates.some((rate) => !rate.rate || Number.isNaN(Number(rate.rate)));
    if (invalid) {
      toast.error("All rates must be numeric.");
      return;
    }
    toast.success("Exchange rates saved.");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Currency controls</span>
          <h1>Exchange Rates</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Manage USD conversion rates used for PKR package pricing, multi-currency display, and invoice totals.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-pill btn-pill-outline" type="button" onClick={refreshRates}>
            Refresh Now
          </button>
          <button className="btn-pill btn-pill-forest" type="button" onClick={saveRates}>
            Save Rates
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {rates.map((rate) => (
          <div className="border p-5" key={rate.currency}>
            <p className="metric-text text-3xl">{rate.rate}</p>
            <p className="mt-2">USD to {rate.currency}</p>
            <p className="mt-1 text-sm text-ink-muted">{rate.override ? "Manual override" : "Auto refreshed"}</p>
          </div>
        ))}
      </section>

      <section className="border">
        <div className="grid gap-3 border-b bg-cream p-4 font-semibold md:grid-cols-[auto_1fr_auto_auto]">
          <span>Currency</span>
          <span>Rate</span>
          <span>Override</span>
          <span>Updated</span>
        </div>
        <div className="divide-y">
          {rates.map((rate) => (
            <div className="grid items-center gap-3 p-4 md:grid-cols-[auto_1fr_auto_auto]" key={rate.currency}>
              <strong>{rate.currency}</strong>
              <input className="input-editorial max-w-xs" value={rate.rate} onChange={(event) => updateRate(rate.currency, event.target.value)} />
              <label className="flex min-h-11 items-center gap-2">
                <input checked={rate.override} type="checkbox" onChange={() => toggleOverride(rate.currency)} />
                <span>Manual</span>
              </label>
              <span>{rate.updatedAt}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
