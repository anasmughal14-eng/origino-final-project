"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SupplierVerificationBadgeClient from "@/app/components/shared/SupplierVerificationBadgeClient";
import { applySupplierOverrides } from "@/app/components/shared/supplierOverrides";
import type { Supplier } from "@/types/database";

const pageSize = 4;

const SUPPLIER_IMAGE_FALLBACKS: Record<string, string> = {
  sialkot: "https://images.pexels.com/photos/27383631/pexels-photo-27383631.jpeg?auto=compress&cs=tinysrgb&w=900",
  faisalabad: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=900",
  lahore: "https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=900",
  karachi: "https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=900",
  gujranwala: "https://images.pexels.com/photos/18469652/pexels-photo-18469652.jpeg?auto=compress&cs=tinysrgb&w=900",
};

type MarketplaceFilters = {
  query?: string;
  category?: string;
  city?: string;
  tier?: string;
  moq?: string;
  certification?: string;
};

export default function MarketplaceClient({ suppliers, initialFilters = {} }: { suppliers: Supplier[]; initialFilters?: MarketplaceFilters }) {
  const [effectiveSuppliers, setEffectiveSuppliers] = useState(() => applySupplierOverrides(suppliers));
  const [query, setQuery] = useState(initialFilters.query ?? "");
  const [category, setCategory] = useState(initialFilters.category ?? "all");
  const [city, setCity] = useState(initialFilters.city ?? "all");
  const [tier, setTier] = useState(initialFilters.tier ?? "all");
  const [moq, setMoq] = useState(initialFilters.moq ?? "all");
  const [cert, setCert] = useState(initialFilters.certification ?? "all");
  const [visible, setVisible] = useState(pageSize);

  useEffect(() => {
    function syncSuppliers() {
      setEffectiveSuppliers(applySupplierOverrides(suppliers));
    }
    syncSuppliers();
    window.addEventListener("storage", syncSuppliers);
    window.addEventListener("origino:supplier-overrides", syncSuppliers);
    return () => {
      window.removeEventListener("storage", syncSuppliers);
      window.removeEventListener("origino:supplier-overrides", syncSuppliers);
    };
  }, [suppliers]);

  const categories = ["all", ...Array.from(new Set(effectiveSuppliers.filter((item) => item.is_active).map((item) => item.category)))];
  const cities = ["all", ...Array.from(new Set(effectiveSuppliers.filter((item) => item.is_active).map((item) => item.city)))];
  const tiers = ["all", "unverified", "self_declared", "document_verified", "site_visited", "origino_certified"];
  const certs = ["all", "ISO", "CE", "FDA", "Halal", "GSP+", "DTRE", "OEKO-TEX", "HACCP"];

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setVisible(pageSize);
  }

  const filtered = useMemo(() => effectiveSuppliers.filter((supplier) => {
    if (!supplier.is_active) return false;
    const haystack = `${supplier.company_name} ${supplier.description} ${supplier.category} ${supplier.city} ${supplier.certifications.join(" ")}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (category !== "all" && supplier.category !== category) return false;
    if (city !== "all" && supplier.city !== city) return false;
    if (tier !== "all" && supplier.verification_tier !== tier) return false;
    if (moq !== "all" && (supplier.moq_usd ?? 0) > Number(moq)) return false;
    if (cert !== "all" && !supplier.certifications.some((item) => item.toLowerCase().includes(cert.toLowerCase()))) return false;
    return true;
  }), [category, cert, city, effectiveSuppliers, moq, query, tier]);

  const shown = filtered.slice(0, visible);

  return (
    <div className="container-editorial pb-16 pt-36">
      <div className="flex flex-col gap-4 border-b border-[rgba(26,26,24,0.12)] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="badge-patch mb-4">Selected manufacturers</p>
          <h1 className="text-[2.8rem] leading-[0.98] md:text-[4.4rem]">Marketplace</h1>
          <p className="mt-3 max-w-2xl text-[#5a5a54]">A shorter list of Pakistani manufacturers, filtered by evidence, category, city, MOQ, and certification.</p>
        </div>
        <div className="text-start md:text-end">
          <p className="metric-numeral text-4xl">{filtered.length}</p>
          <p className="text-sm text-[#5a5a54]">shown</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="marketplace-filters panel-soft relative z-10 h-max space-y-4 p-5 lg:sticky lg:top-28">
          <label className="block text-xs uppercase tracking-[0.16em] text-[#8a8a82]">Search</label>
          <input className="input-editorial min-h-[44px] bg-[#fdfbf8]" placeholder="Search by work, city, or evidence" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(pageSize); }} />

          <label className="block text-xs uppercase tracking-[0.16em] text-[#8a8a82]">Category</label>
          <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={category} onChange={(event) => updateFilter(setCategory, event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>

          <label className="block text-xs uppercase tracking-[0.16em] text-[#8a8a82]">City</label>
          <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={city} onChange={(event) => updateFilter(setCity, event.target.value)}>{cities.map((item) => <option key={item}>{item}</option>)}</select>

          <label className="block text-xs uppercase tracking-[0.16em] text-[#8a8a82]">Verification</label>
          <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={tier} onChange={(event) => updateFilter(setTier, event.target.value)}>{tiers.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select>

          <label className="block text-xs uppercase tracking-[0.16em] text-[#8a8a82]">MOQ</label>
          <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={moq} onChange={(event) => updateFilter(setMoq, event.target.value)}>
            <option value="all">Any MOQ</option>
            <option value="2500">Under $2,500</option>
            <option value="5000">Under $5,000</option>
            <option value="10000">Under $10,000</option>
          </select>

          <label className="block text-xs uppercase tracking-[0.16em] text-[#8a8a82]">Certification</label>
          <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={cert} onChange={(event) => updateFilter(setCert, event.target.value)}>{certs.map((item) => <option key={item}>{item}</option>)}</select>
        </aside>

        <section>
          {shown.length === 0 && <div className="panel-soft p-8 text-center">Nothing considered fits these filters yet.</div>}
          <div className="space-y-4">
            {shown.map((supplier) => (
              <Link key={supplier.id} href={`/suppliers/${supplier.slug}`} className="group grid overflow-hidden rounded-[28px] border border-[rgba(26,26,24,0.09)] bg-[#fdfbf8] shadow-[0_18px_70px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-[rgba(79,91,58,0.32)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.08)] md:grid-cols-[240px_1fr]">
                <div className="relative min-h-[210px] overflow-hidden bg-[var(--cream-dark)]">
                  <img
                    src={supplier.hero_image_url || SUPPLIER_IMAGE_FALLBACKS[supplier.cluster] || SUPPLIER_IMAGE_FALLBACKS.sialkot}
                    alt={supplier.company_name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.32)] to-transparent" />
                  <p className="absolute bottom-4 left-4 rounded-full bg-[rgba(254,253,251,0.86)] px-3 py-1 text-xs font-medium text-[var(--forest)] backdrop-blur-md">{supplier.city}</p>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl transition-colors group-hover:text-[var(--forest)]">{supplier.company_name}</h2>
                      <p className="mt-2 text-sm text-[#5a5a54]">{supplier.city} / {supplier.category}</p>
                    </div>
                    <SupplierVerificationBadgeClient supplierId={supplier.id} tier={supplier.verification_tier} />
                  </div>
                  <p className="mt-4 text-[#5a5a54]">{supplier.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {supplier.certifications.slice(0, 3).map((certification) => <span className="badge-patch" key={certification}>{certification}</span>)}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-4 border-t border-[rgba(26,26,24,0.1)] pt-4 text-sm">
                    <p><span className="metric-numeral">MOQ ${supplier.moq_usd?.toLocaleString()}</span></p>
                    <p><span className="metric-numeral">Response {supplier.response_rate}%</span></p>
                    <p><span className="metric-numeral">{supplier.lead_time_days}</span></p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {visible < filtered.length && <button className="btn-pill btn-pill-outline mt-6 min-h-[44px]" onClick={() => setVisible((value) => value + pageSize)}>Load More</button>}
        </section>
      </div>
    </div>
  );
}
