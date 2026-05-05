"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type Scheme = {
  id: string;
  name: string;
  agency: string;
  category: string;
  deadline: string;
  eligibility: string[];
  saved: boolean;
};

const initialSchemes: Scheme[] = [
  {
    id: "tdap-edf",
    name: "TDAP Export Development Fund",
    agency: "TDAP",
    category: "Marketing support",
    deadline: "2026-06-30",
    eligibility: ["Active NTN", "Export-ready catalog", "Target market plan"],
    saved: true,
  },
  {
    id: "sbp-efs",
    name: "SBP Export Finance Scheme",
    agency: "State Bank of Pakistan",
    category: "Working capital",
    deadline: "Rolling",
    eligibility: ["Confirmed export order", "Bank account", "Clean repayment history"],
    saved: false,
  },
  {
    id: "dtre",
    name: "DTRE Registration",
    agency: "FBR",
    category: "Duty relief",
    deadline: "Rolling",
    eligibility: ["Manufacturing exporter", "Input-output records", "FBR registration"],
    saved: false,
  },
  {
    id: "smeda",
    name: "SMEDA SME Support Program",
    agency: "SMEDA",
    category: "Business development",
    deadline: "2026-08-15",
    eligibility: ["SME exporter", "Business plan", "Training attendance"],
    saved: false,
  },
];

export default function SellerGovernmentSchemesPage() {
  const [schemes, setSchemes] = useState(initialSchemes);
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set(schemes.map((scheme) => scheme.category)))], [schemes]);
  const visibleSchemes = useMemo(
    () => schemes.filter((scheme) => category === "all" || scheme.category === category),
    [category, schemes],
  );

  function toggleSaved(id: string) {
    setSchemes((current) => current.map((scheme) => (scheme.id === id ? { ...scheme, saved: !scheme.saved } : scheme)));
    toast.success("Scheme saved status updated.");
  }

  function openScheme(scheme: Scheme) {
    toast.success(`${scheme.agency} application portal will open after official link is configured.`);
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Pakistan export support</span>
          <h1>Government Schemes</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            TDAP, SMEDA, SBP, FBR, and sector support programs matched to the seller profile.
          </p>
        </div>
        <select className="input-editorial min-h-11 max-w-xs" value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All categories" : item}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="border p-5">
          <p className="metric-text text-3xl">{schemes.length}</p>
          <p className="mt-2 text-ink-soft">Eligible schemes</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">{schemes.filter((scheme) => scheme.saved).length}</p>
          <p className="mt-2 text-ink-soft">Saved for later</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">3</p>
          <p className="mt-2 text-ink-soft">Profile fields matched</p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {visibleSchemes.map((scheme) => (
          <div className="border p-5" key={scheme.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="badge-patch">{scheme.agency}</span>
                <h2 className="mt-3 text-2xl">{scheme.name}</h2>
                <p className="mt-2 text-ink-soft">{scheme.category}</p>
                <p className="mt-2 metric-text">Deadline {scheme.deadline}</p>
              </div>
              {scheme.saved ? <span className="badge-patch">Saved</span> : null}
            </div>
            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">Eligibility checklist</p>
              <ul className="mt-3 space-y-2">
                {scheme.eligibility.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <span>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="btn-pill btn-pill-forest" type="button" onClick={() => openScheme(scheme)}>
                Open Application
              </button>
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => toggleSaved(scheme.id)}>
                {scheme.saved ? "Remove Saved" : "Save for Later"}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
