"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const fields = [
  ["company", "Company name"],
  ["country", "Country"],
  ["industry", "Industry"],
  ["vat", "VAT number"],
  ["duns", "DUNS number"],
  ["annualImport", "Annual import volume"],
  ["website", "Website"],
] as const;

export default function BuyerCompanyProfilePage() {
  const [form, setForm] = useState<Record<string, string>>({
    company: "Hansa Medical Imports GmbH",
    country: "Germany",
    industry: "Medical distribution",
    vat: "DE123456789",
    duns: "315123456",
    annualImport: "$500k-$1m",
    website: "https://example.com",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.company.trim() || !form.country.trim() || !form.industry.trim()) {
      setError("Company name, country, and industry are required.");
      return;
    }
    if (form.website && !/^https?:\/\/.+\..+/.test(form.website)) {
      setError("Website must start with http:// or https://.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/buyer/company-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!payload.success) {
        setError(payload.error ?? "Company profile could not be saved.");
        return;
      }
      toast.success("Company profile saved");
    } catch {
      setError("Company profile could not be saved.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-4xl">Company Profile <span className="badge-patch stamp-approve">Verified</span></h1>
      <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
        {fields.map(([field, label]) => (
          <label className={field === "website" ? "block md:col-span-2" : "block"} key={field}>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">{label}</span>
            <input className="input-editorial min-h-[44px]" value={form[field] ?? ""} onChange={(event) => update(field, event.target.value)} />
          </label>
        ))}
        {error && <p className="text-sm text-[#c0623a] md:col-span-2">{error}</p>}
        <button className="btn-pill btn-pill-forest min-h-[44px]" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
      </form>
    </div>
  );
}
