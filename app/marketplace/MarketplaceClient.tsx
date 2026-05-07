"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject, ReactNode } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import SupplierVerificationBadgeClient from "@/app/components/shared/SupplierVerificationBadgeClient";
import { applySupplierOverrides } from "@/app/components/shared/supplierOverrides";
import type { MarketplaceStats } from "@/lib/data-service";
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

type CategoryCard = {
  name: string;
  image: string;
};

const categoryGroups = [
  {
    label: "Industrial & Manufacturing",
    items: [
      "Surgical & Medical Instruments",
      "Engineering & Light Manufacturing",
      "Automotive Parts",
      "Construction Materials",
      "Packaging Materials",
      "Chemicals & Pharmaceuticals",
    ],
  },
  {
    label: "Textiles & Fashion",
    items: [
      "Textiles & Apparel",
      "Leather Goods",
      "Sporting Goods",
      "Sports Apparel & Uniforms",
      "Rugs & Carpets",
      "Medical Textiles & PPE",
    ],
  },
  {
    label: "Food & Natural Resources",
    items: [
      "Food & Agriculture",
      "Salt & Minerals",
      "Seafood & Marine Products",
      "Spices & Condiments",
      "Organic & Specialty Foods",
    ],
  },
  {
    label: "Home & Lifestyle",
    items: [
      "Furniture & Handicrafts",
      "Ceramics & Glassware",
      "Jewelry & Gemstones",
      "Home Textiles & Bedding",
      "Decorative Arts & Crafts",
    ],
  },
  {
    label: "Technology & Services",
    items: [
      "IT Services & Software",
      "Electronics & Components",
      "Solar & Energy Products",
      "BPO & Data Services",
    ],
  },
];

const categoryCards: CategoryCard[] = [
  { name: "Surgical & Medical Instruments", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80" },
  { name: "Textiles & Apparel", image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80" },
  { name: "Sporting Goods", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80" },
  { name: "Leather Goods", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
  { name: "Engineering & Light Manufacturing", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80" },
  { name: "Food & Agriculture", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80" },
  { name: "Salt & Minerals", image: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&q=80" },
  { name: "Furniture & Handicrafts", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80" },
  { name: "Chemicals & Pharmaceuticals", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80" },
  { name: "IT Services & Software", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" },
  { name: "Automotive Parts", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80" },
  { name: "Ceramics & Glassware", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80" },
  { name: "Construction Materials", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" },
  { name: "Packaging Materials", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80" },
  { name: "Jewelry & Gemstones", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80" },
  { name: "Rugs & Carpets", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&q=80" },
  { name: "Sports Apparel & Uniforms", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
  { name: "Medical Textiles & PPE", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80" },
];

const cityOptions = [
  { city: "all", label: "All Cities", province: "Default" },
  { city: "Sialkot", label: "Sialkot", province: "Punjab" },
  { city: "Faisalabad", label: "Faisalabad", province: "Punjab" },
  { city: "Lahore", label: "Lahore", province: "Punjab" },
  { city: "Karachi", label: "Karachi", province: "Sindh" },
  { city: "Gujranwala", label: "Gujranwala", province: "Punjab" },
  { city: "Peshawar", label: "Peshawar", province: "KPK" },
  { city: "Multan", label: "Multan", province: "Punjab" },
  { city: "Quetta", label: "Quetta", province: "Balochistan" },
  { city: "Islamabad", label: "Islamabad", province: "Federal" },
  { city: "Hyderabad", label: "Hyderabad", province: "Sindh" },
  { city: "Rawalpindi", label: "Rawalpindi", province: "Punjab" },
  { city: "Sargodha", label: "Sargodha", province: "Punjab" },
  { city: "Bahawalpur", label: "Bahawalpur", province: "Punjab" },
  { city: "Sukkur", label: "Sukkur", province: "Sindh" },
  { city: "Gujrat", label: "Gujrat", province: "Punjab" },
  { city: "Wazirabad", label: "Wazirabad", province: "Punjab" },
  { city: "Sheikhupura", label: "Sheikhupura", province: "Punjab" },
  { city: "Rahim Yar Khan", label: "Rahim Yar Khan", province: "Punjab" },
];

const tiers = ["all", "unverified", "self_declared", "document_verified", "site_visited", "origino_certified"];
const certs = ["all", "ISO", "CE", "FDA", "Halal", "GSP+", "DTRE", "OEKO-TEX", "HACCP"];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function MarketplaceClient({
  suppliers,
  stats,
  initialFilters = {},
}: {
  suppliers: Supplier[];
  stats: MarketplaceStats;
  initialFilters?: MarketplaceFilters;
}) {
  const [effectiveSuppliers, setEffectiveSuppliers] = useState(() => applySupplierOverrides(suppliers));
  const [query, setQuery] = useState(initialFilters.query ?? "");
  const [category, setCategory] = useState(initialFilters.category ?? "all");
  const [city, setCity] = useState(initialFilters.city ?? "all");
  const [tier, setTier] = useState(initialFilters.tier ?? "all");
  const [moq, setMoq] = useState(initialFilters.moq ?? "all");
  const [cert, setCert] = useState(initialFilters.certification ?? "all");
  const [visible, setVisible] = useState(pageSize);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"buyers" | "manufacturers">("buyers");
  const filterRef = useRef<HTMLElement | null>(null);

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

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setVisible(pageSize);
  }

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setCity("all");
    setTier("all");
    setMoq("all");
    setCert("all");
    setVisible(pageSize);
  }

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory);
    setVisible(pageSize);
    filterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const activeSuppliers = effectiveSuppliers.filter((supplier) => supplier.is_active);
  const totalSupplierCount = activeSuppliers.length;

  const filtered = useMemo(() => activeSuppliers.filter((supplier) => {
    const haystack = `${supplier.company_name} ${supplier.description} ${supplier.category} ${supplier.city} ${supplier.certifications.join(" ")}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (category !== "all" && supplier.category !== category) return false;
    if (city !== "all" && supplier.city !== city) return false;
    if (tier !== "all" && supplier.verification_tier !== tier) return false;
    if (moq !== "all" && (supplier.moq_usd ?? 0) > Number(moq)) return false;
    if (cert !== "all" && !supplier.certifications.some((item) => item.toLowerCase().includes(cert.toLowerCase()))) return false;
    return true;
  }), [activeSuppliers, category, cert, city, moq, query, tier]);

  const shown = filtered.slice(0, visible);
  const activeFilterCount = [query, category !== "all", city !== "all", tier !== "all", moq !== "all", cert !== "all"].filter(Boolean).length;
  const allFiltersDefault = activeFilterCount === 0;
  const showCategoryGrid = totalSupplierCount === 0 && allFiltersDefault;
  const showZeroState = shown.length === 0;
  const currentCategory = category === "all" ? "All categories" : category;
  const currentCity = city === "all" ? "All cities" : city;

  const statsRow = [
    [stats.applicationsReceived || "Applications Open", "Applications Received"],
    [stats.liveManufacturers || "Coming Soon", "Live Manufacturers"],
    [5, "Export Sectors"],
    ["OFAC / UN / EU / HMT", "Sanctions Lists Screened"],
  ];

  return (
    <div className="mx-auto w-full max-w-[1540px] px-4 pb-16 pt-32 md:px-6 md:pt-36">
      <div className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <p className="badge-patch mb-4">For Global Buyers</p>
          <div className="relative mt-5 max-w-4xl px-3 py-4 md:px-5 md:py-5">
            <div className="absolute -inset-x-1 -inset-y-1 rounded-[26px] border border-[rgba(84,98,64,0.2)] bg-[linear-gradient(135deg,rgba(238,240,227,0.95),rgba(255,248,235,0.9))] shadow-[0_22px_70px_rgba(84,98,64,0.16)] md:-inset-x-2 md:-inset-y-2 md:rounded-[34px]" />
            <h1 className="relative text-[2.7rem] leading-[0.95] md:text-[4.4rem]">Selected manufacturers. Not endless options.</h1>
          </div>
          <p className="mt-5 max-w-2xl text-[1.02rem] leading-7 text-[#5a5a54] md:text-lg md:leading-8">
            Every manufacturer listed here has been audit scored across 6 categories, sanctions screened against OFAC, UN, EU, and HMT lists, and approved by admin review. Documents, verification tier, and buyer context are visible before a message is sent.
          </p>
        </div>
        <div className="panel-soft border-[rgba(84,98,64,0.22)] bg-[rgba(238,240,227,0.64)] p-5 shadow-[0_24px_70px_rgba(79,91,58,0.12)] md:p-6">
          <p className="section-kicker text-[var(--forest)]">Marketplace</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {statsRow.map(([value, label]) => (
              <div className="min-w-0 rounded-[18px] border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.72)] p-3" key={label}>
                <p className="metric-numeral break-words text-base leading-tight md:text-lg">{value}</p>
                <p className="mt-2 text-[0.68rem] leading-5 text-[#5a5a54]">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3 rounded-[18px] border border-[rgba(198,161,89,0.28)] bg-[rgba(255,248,235,0.72)] px-4 py-3 text-sm leading-6 text-[#5a5a54]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" aria-hidden="true" />
            <span>Buyer trust is protected by selection, evidence, and admin review.</span>
          </div>
        </div>
      </div>

      <CityStrip city={city} onChange={(nextCity) => updateFilter(setCity, nextCity)} />

      <div className="sticky top-24 z-20 mt-6 lg:hidden">
        <button className="btn-pill btn-pill-forest w-full justify-center" type="button" onClick={() => setFiltersOpen(true)}>
          Filters {activeFilterCount > 0 ? `(${activeFilterCount} active)` : ""}
        </button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          refTarget={filterRef}
          query={query}
          category={category}
          city={city}
          tier={tier}
          moq={moq}
          cert={cert}
          activeFilterCount={activeFilterCount}
          onQueryChange={(value) => updateFilter(setQuery, value)}
          onCategoryChange={(value) => updateFilter(setCategory, value)}
          onCityChange={(value) => updateFilter(setCity, value)}
          onTierChange={(value) => updateFilter(setTier, value)}
          onMoqChange={(value) => updateFilter(setMoq, value)}
          onCertChange={(value) => updateFilter(setCert, value)}
          onClear={clearFilters}
          className="hidden lg:block"
        />

        <section className="min-w-0">
          {showCategoryGrid && <CategoryGrid onSelect={chooseCategory} />}
          {showZeroState && (
            <ZeroState
              allFiltersDefault={allFiltersDefault && totalSupplierCount === 0}
              category={currentCategory}
              city={currentCity}
            />
          )}
          <div className="space-y-4">
            {shown.map((supplier) => (
              <SupplierCard supplier={supplier} key={supplier.id} />
            ))}
          </div>
          {visible < filtered.length && <button className="btn-pill btn-pill-outline mt-6 min-h-[44px]" onClick={() => setVisible((value) => value + pageSize)}>Load More</button>}
        </section>
      </div>

      <RfqBanner />
      <CurationPipeline stats={stats} />
      <HowItWorks activeTab={activeTab} setActiveTab={setActiveTab} />

      {filtersOpen && (
        <div className="fixed inset-0 z-50 bg-[rgba(26,26,24,0.28)] lg:hidden">
          <div className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-[28px] bg-[var(--cream)] p-4 shadow-[0_-18px_60px_rgba(0,0,0,0.18)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="section-kicker">Filters</p>
              <button className="btn-pill btn-pill-outline min-h-[40px]" type="button" onClick={() => setFiltersOpen(false)}>Close</button>
            </div>
            <FilterSidebar
              query={query}
              category={category}
              city={city}
              tier={tier}
              moq={moq}
              cert={cert}
              activeFilterCount={activeFilterCount}
              onQueryChange={(value) => updateFilter(setQuery, value)}
              onCategoryChange={(value) => updateFilter(setCategory, value)}
              onCityChange={(value) => updateFilter(setCity, value)}
              onTierChange={(value) => updateFilter(setTier, value)}
              onMoqChange={(value) => updateFilter(setMoq, value)}
              onCertChange={(value) => updateFilter(setCert, value)}
              onClear={clearFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CityStrip({ city, onChange }: { city: string; onChange: (city: string) => void }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative mt-10">
      <div ref={scrollRef} className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-2 md:max-h-[76px] md:flex-wrap md:overflow-x-auto md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
        {cityOptions.map((item) => {
          const active = city === item.city;
          return (
            <button className={`rounded-full border px-4 py-2 text-left text-sm font-semibold transition ${active ? "border-[var(--forest)] bg-[var(--forest)] text-[var(--cream)]" : "border-[var(--ink)] bg-transparent text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)]"}`} key={item.city} type="button" onClick={() => onChange(item.city)}>
              <span className="block leading-tight">{item.label}</span>
              <span className="block text-[0.68rem] leading-tight opacity-70">{item.province}</span>
            </button>
          );
        })}
        </div>
      </div>
      <button
        aria-label="See previous cities"
        className="absolute left-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(26,26,24,0.16)] bg-[rgba(255,250,242,0.92)] text-lg font-semibold text-[var(--forest)] shadow-[0_12px_34px_rgba(64,52,38,0.10)] md:flex"
        type="button"
        onClick={() => scrollRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
      >
        &lt;
      </button>
      <button
        aria-label="See more cities"
        className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(26,26,24,0.16)] bg-[rgba(255,250,242,0.92)] text-lg font-semibold text-[var(--forest)] shadow-[0_12px_34px_rgba(64,52,38,0.10)] md:flex"
        type="button"
        onClick={() => scrollRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
      >
        &gt;
      </button>
    </div>
  );
}

function FilterSidebar({
  refTarget,
  query,
  category,
  city,
  tier,
  moq,
  cert,
  activeFilterCount,
  onQueryChange,
  onCategoryChange,
  onCityChange,
  onTierChange,
  onMoqChange,
  onCertChange,
  onClear,
  className = "",
}: {
  refTarget?: MutableRefObject<HTMLElement | null>;
  query: string;
  category: string;
  city: string;
  tier: string;
  moq: string;
  cert: string;
  activeFilterCount: number;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onTierChange: (value: string) => void;
  onMoqChange: (value: string) => void;
  onCertChange: (value: string) => void;
  onClear: () => void;
  className?: string;
}) {
  return (
    <aside ref={(node) => { if (refTarget) refTarget.current = node; }} className={`marketplace-filters panel-soft relative z-10 h-max space-y-3 border-[rgba(84,98,64,0.16)] bg-[rgba(255,250,242,0.72)] p-5 shadow-[0_24px_70px_rgba(79,91,58,0.1)] lg:sticky lg:top-28 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="section-kicker">Filters</p>
        {activeFilterCount > 0 && <span className="rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-white">({activeFilterCount} active)</span>}
      </div>
      <FilterGroup label="Search">
        <input className="input-editorial min-h-[44px] bg-[#fdfbf8]" placeholder="Search by work, city, or evidence" value={query} onChange={(event) => onQueryChange(event.target.value)} />
      </FilterGroup>
      <FilterGroup label="Category">
        <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="all">all</option>
          {categoryGroups.map((group) => (
            <optgroup label={group.label} key={group.label}>
              {group.items.map((item) => <option key={item} value={item}>{item}</option>)}
            </optgroup>
          ))}
        </select>
      </FilterGroup>
      <FilterGroup label="City">
        <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={city} onChange={(event) => onCityChange(event.target.value)}>
          {cityOptions.map((item) => <option key={item.city} value={item.city}>{item.label}</option>)}
        </select>
      </FilterGroup>
      <FilterGroup label="Verification">
        <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={tier} onChange={(event) => onTierChange(event.target.value)}>{tiers.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select>
      </FilterGroup>
      <FilterGroup label="MOQ">
        <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={moq} onChange={(event) => onMoqChange(event.target.value)}>
          <option value="all">Any MOQ</option>
          <option value="2500">Under $2,500</option>
          <option value="5000">Under $5,000</option>
          <option value="10000">Under $10,000</option>
        </select>
      </FilterGroup>
      <FilterGroup label="Certification">
        <select className="input-editorial min-h-[44px] bg-[#fdfbf8]" value={cert} onChange={(event) => onCertChange(event.target.value)}>{certs.map((item) => <option key={item}>{item}</option>)}</select>
      </FilterGroup>
      <button className="mt-2 text-sm font-semibold text-[var(--forest)]" type="button" onClick={onClear}>Clear all filters</button>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-[rgba(84,98,64,0.12)] pt-3">
      <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-[#8a8a82]">{label}</label>
      {children}
    </div>
  );
}

function CategoryGrid({ onSelect }: { onSelect: (category: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {categoryCards.map((card) => (
        <button className="group overflow-hidden rounded-[28px] bg-[#fdfbf8] text-left shadow-[0_18px_70px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_20px_70px_rgba(0,0,0,0.08)]" key={card.name} type="button" onClick={() => onSelect(card.name)}>
          <span className="relative block h-[120px] overflow-hidden md:h-[150px] xl:h-[170px]">
            <img className="h-full w-full object-cover object-center transition duration-[400ms] group-hover:scale-105" src={card.image} alt={`${card.name} suppliers category in Pakistan`} />
            <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.70)_0%,rgba(0,0,0,0.15)_100%)]" />
            <span className="absolute right-3 top-3 rounded-full bg-[var(--gold)] px-3 py-1 text-[0.68rem] font-semibold text-white">Coming Soon</span>
          </span>
          <span className="block px-4 py-4">
            <span className="block text-sm font-semibold leading-tight text-[var(--ink)] md:text-base">{card.name}</span>
            <span className="mt-1 hidden text-xs leading-5 text-[#5a5a54] md:block">Suppliers being onboarded</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function ZeroState({ allFiltersDefault, category, city }: { allFiltersDefault: boolean; category: string; city: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!isValidEmail(email)) {
      setError("Enter a valid business email.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/buyer-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category, city }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error ?? "Supabase insert failed.");
      setMessage(`You're on the list. We will notify you at ${email} when suppliers in this category are verified and live.`);
    } catch (insertError) {
      setError(insertError instanceof Error ? insertError.message : "Supabase insert failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="panel-soft mb-6 mt-8 p-6 md:p-8">
      <ShieldCheck className="h-7 w-7 text-[var(--forest)] opacity-70" aria-hidden="true" />
      <h2 className="mt-4 text-3xl">{allFiltersDefault ? "The marketplace opens soon" : "Verified suppliers coming soon"}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-[#5a5a54]">
        {allFiltersDefault
          ? "Every supplier on ORIGINO passes a 6-category audit and sanctions screening against OFAC, UN, EU and HMT lists before listing. Our first verified manufacturers are being onboarded now."
          : "We are onboarding manufacturers in this category. Be the first buyer notified when verified suppliers go live. One email, no spam."}
      </p>
      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={submit}>
        <input className="input-editorial min-h-[48px]" placeholder="Your business email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input type="hidden" value={category} name="category" />
        <input type="hidden" value={city} name="city" />
        <button className="btn-pill btn-pill-forest min-h-[48px] justify-center" disabled={submitting} type="submit">{submitting ? "Saving..." : "Notify Me When Live"}</button>
      </form>
      {message && <p className="mt-4 rounded-[18px] border border-[rgba(84,98,64,0.14)] bg-[rgba(238,240,227,0.64)] p-4 text-sm leading-6 text-[var(--forest)]">{message}</p>}
      {error && <p className="mt-4 rounded-[18px] border border-[var(--terracotta)] bg-[rgba(201,133,103,0.10)] p-4 text-sm leading-6 text-[var(--terracotta)]">{error}</p>}
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Link href={`/suppliers/${supplier.slug}`} className="group grid overflow-hidden rounded-[28px] border border-[rgba(26,26,24,0.09)] bg-[#fdfbf8] shadow-[0_18px_70px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-[rgba(79,91,58,0.32)] hover:shadow-[0_20px_70px_rgba(0,0,0,0.08)] md:grid-cols-[240px_1fr]">
      <div className="relative min-h-[210px] overflow-hidden bg-[var(--cream-dark)]">
        <img src={supplier.hero_image_url || SUPPLIER_IMAGE_FALLBACKS[supplier.cluster] || SUPPLIER_IMAGE_FALLBACKS.sialkot} alt={supplier.company_name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(26,26,26,0.32)] to-transparent" />
        <p className="absolute bottom-4 left-4 rounded-full bg-[rgba(254,253,251,0.86)] px-3 py-1 text-xs font-medium text-[var(--forest)] backdrop-blur-md">{supplier.city}</p>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl transition-colors group-hover:text-[var(--forest)]">{supplier.company_name}</h2>
            <p className="mt-2 text-sm text-[#5a5a54]">{supplier.city}, {supplier.category}</p>
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
  );
}

function CurationPipeline({ stats }: { stats: MarketplaceStats }) {
  const stages = [
    ["01", "Application Received", stats.applicationsReceived],
    ["02", "Audit Scored", stats.auditScored],
    ["03", "Under Review", stats.underReview],
    ["04", "Live on Marketplace", stats.liveManufacturers],
  ];
  return (
    <section className="mt-14">
      <h2 className="text-3xl">Our Curation Process</h2>
      <div className="mt-6 overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-4 gap-4">
          {stages.map(([number, label, count], index) => (
            <div className="relative text-center" key={label}>
              {index < stages.length - 1 && <div className="absolute left-1/2 top-6 h-px w-full bg-[rgba(84,98,64,0.18)]" />}
              <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(84,98,64,0.18)] bg-[rgba(255,250,242,0.86)] font-semibold text-[var(--forest)]">{number}</div>
              <p className="mt-3 font-semibold">{label}</p>
              {Number(count) > 0 && <span className="mt-2 inline-flex rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-semibold text-white">{count}</span>}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 text-sm italic text-[#5a5a54]">Every manufacturer earns their place. None are listed by default.</p>
    </section>
  );
}

function HowItWorks({ activeTab, setActiveTab }: { activeTab: "buyers" | "manufacturers"; setActiveTab: (tab: "buyers" | "manufacturers") => void }) {
  const steps = activeTab === "buyers"
    ? [
        ["01", "Browse or Post", "Search verified categories or post a sourcing request with your exact requirements."],
        ["02", "Review Evidence", "See audit scores, verification tier, documents, and response rates before contacting anyone."],
        ["03", "Send Inquiry", "Contact directly through ORIGINO. Your identity stays protected until you choose to share it."],
        ["04", "Trade Protected", "Use ORIGINO escrow for payment protection on all confirmed orders."],
      ]
    : [
        ["01", "Apply and Get Scored", "Complete the free export readiness audit and get a personalised score across 6 categories with AI-generated feedback specific to your cluster and target market."],
        ["02", "Build Your Profile", "Upload documents, add products, set your availability, incoterms, and lead times."],
        ["03", "Receive Qualified Leads", "Only verified, intent-scored buyers can contact you. No cold spam, no time wasters."],
        ["04", "Grow With Support", "Access marketing packages, government scheme guides, trade finance tools, and virtual factory tour scheduling."],
      ];
  return (
    <section className="mt-14">
      <div className="flex flex-wrap gap-3">
        <button className={`btn-pill ${activeTab === "buyers" ? "btn-pill-forest" : "btn-pill-outline"}`} type="button" onClick={() => setActiveTab("buyers")}>For Buyers</button>
        <button className={`btn-pill ${activeTab === "manufacturers" ? "btn-pill-forest" : "btn-pill-outline"}`} type="button" onClick={() => setActiveTab("manufacturers")}>For Manufacturers</button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {steps.map(([number, title, body]) => (
          <div className="panel-soft p-5" key={title}>
            <p className="metric-numeral text-2xl text-[var(--forest)]">{number}</p>
            <h3 className="mt-4 text-2xl">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#5a5a54]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RfqBanner() {
  return (
    <section className="mt-14 rounded-[28px] bg-[var(--forest)] p-6 text-[var(--cream)] md:p-8">
      <div className="grid gap-6 md:grid-cols-[1fr_280px] md:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(247,244,239,0.72)]">FOR GLOBAL BUYERS</p>
          <h2 className="mt-4 text-4xl">Can&apos;t find what you need?</h2>
          <p className="mt-4 max-w-2xl leading-7 text-[rgba(247,244,239,0.76)]">Post a sourcing request and our team will personally match you with verified Pakistani manufacturers. Responses within 48 hours.</p>
        </div>
        <div>
          <Link className="btn-pill min-h-[48px] w-full justify-center bg-[var(--cream)] text-[var(--forest)]" href="/rfq/new">Post a Sourcing Request</Link>
          <Link className="mt-4 block text-center text-sm text-[rgba(247,244,239,0.82)]" href="https://wa.me/923324823947">Or WhatsApp us directly</Link>
        </div>
      </div>
    </section>
  );
}
