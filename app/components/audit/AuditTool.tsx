"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type AuditResult = {
  score: number;
  status: "approved" | "conditional" | "not_ready";
  tier: string;
  breakdown: Record<string, number>;
  feedback: string;
  aiUsed: boolean;
};

const categories = [
  "Textiles & Apparel",
  "Surgical & Medical Instruments",
  "Sporting Goods",
  "Leather Goods",
  "Engineering & Light Manufacturing",
  "Food & Agriculture",
  "Chemicals & Pharmaceuticals",
  "Salt & Minerals",
  "IT Services & Software",
  "Furniture & Handicrafts",
];

const cities = ["Sialkot", "Faisalabad", "Lahore", "Karachi", "Gujranwala"];
const certifications = ["ISO 13485", "OEKO-TEX", "CE", "FDA", "Halal", "GSP+", "DTRE", "SECP Registered"];

const scoreLabels: Record<string, string> = {
  brand: "Brand & Identity",
  digital: "Digital Presence",
  export: "Export Experience",
  product: "Product Readiness",
  operations: "Operational Capacity",
  compliance: "Compliance & Documents",
};

export default function AuditTool({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [form, setForm] = useState({
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    city: "",
    category: "",
    yearsInBusiness: "",
    productDescription: "",
    hsCode: "",
    targetMarkets: "",
    capacity: "",
    leadTime: "",
    website: "",
    instagram: "",
    linkedin: "",
    exportCountries: "",
    hasExported: false,
    hasBuyerRelationships: false,
    hasLogo: false,
    hasBrandConsistency: false,
    hasPackaging: false,
    hasEnglishCatalog: false,
    hasPhotography: false,
    ntn: false,
    hasExportDocs: false,
  });
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Array<{ name: string; url: string }>>([]);

  const progress = useMemo(() => Math.round((step / 6) * 100), [step]);

  function update(field: keyof typeof form, value: string | boolean) {
    setError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleCertification(item: string) {
    setError("");
    setSelectedCertifications((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  function addDocument(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setDocuments((current) => [...current, file.name]);
    setError("");
  }

  function addPhoto(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setPhotos((current) => [...current, { name: file.name, url: URL.createObjectURL(file) }]);
    setError("");
  }

  function validateStep() {
    if (step === 1 && (!form.companyName.trim() || !form.city || !form.category)) return "Company, city, and product category are required.";
    if (step === 2 && (!form.productDescription.trim() || !form.capacity.trim() || !form.leadTime.trim())) return "Product description, capacity, and lead time are required.";
    if (step === 3 && !form.targetMarkets.trim()) return "Target markets are required.";
    if (step === 4 && !form.ntn && !form.hasExportDocs && documents.length === 0) return "Add at least one compliance item or document.";
    if (step === 5 && !form.hasPhotography && photos.length === 0) return "Add product photography evidence or upload a photo.";
    return "";
  }

  function next() {
    const message = validateStep();
    if (message) return setError(message);
    setError("");
    setStep((current) => Math.min(6, current + 1));
  }

  async function submit() {
    const message = validateStep();
    if (message) return setError(message);
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/submit-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          yearsInBusiness: Number(form.yearsInBusiness || 0),
          certifications: selectedCertifications,
          hasDocuments: documents.length > 0,
          hasPhotography: form.hasPhotography || photos.length > 0,
        }),
      });
      const json = (await response.json()) as { success: boolean; data?: AuditResult; error?: string };
      if (!response.ok || !json.success || !json.data) {
        setError(json.error ?? "Audit submission failed.");
        return;
      }
      setResult(json.data);
      toast.success("Audit score generated");
    } catch {
      setError("Audit submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={compact ? "" : "page-enter pt-28"}>
      <section className={compact ? "" : "container-editorial pb-16"}>
        {!compact && (
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="section-kicker">AI Audit Engine</p>
              <h1 className="mt-5 text-5xl md:text-7xl">Export readiness audit.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--ink-muted)]">
                This is the strict ORIGINO seller gate from the original spec: brand, digital presence, export history, product readiness, operations, and compliance are scored out of 100 before a supplier can be listed.
              </p>
            </div>
            <div className="panel-soft p-6">
              <h2 className="text-3xl">Decision rules</h2>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="rounded-full border border-[rgba(84,98,64,0.14)] px-4 py-3"><strong>80-100:</strong> Approved for admin verification visit</div>
                <div className="rounded-full border border-[rgba(184,145,58,0.22)] px-4 py-3"><strong>60-79:</strong> Conditional, marketing support required</div>
                <div className="rounded-full border border-[rgba(201,133,103,0.24)] px-4 py-3"><strong>0-59:</strong> Not ready, roadmap shown first</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr]">
          <div className="panel-soft p-5 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="small-caps text-sm text-[var(--ink-muted)]">Step {step} of 6</p>
                <h2 className="mt-1 text-3xl">{["Company basics", "Product readiness", "Export history", "Compliance vault", "Brand evidence", "Score review"][step - 1]}</h2>
              </div>
              <span className="metric-numeral text-2xl">{progress}%</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(84,98,64,0.12)]">
              <div className="h-full rounded-full bg-[var(--forest)] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-8">
              {step === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="input-editorial" placeholder="Company name" value={form.companyName} onChange={(event) => update("companyName", event.target.value)} />
                  <input className="input-editorial" placeholder="Owner / contact name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} />
                  <input className="input-editorial" placeholder="Email" value={form.email} onChange={(event) => update("email", event.target.value)} />
                  <input className="input-editorial" placeholder="Phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
                  <select className="input-editorial" value={form.city} onChange={(event) => update("city", event.target.value)}>
                    <option value="">City cluster</option>
                    {cities.map((city) => <option key={city}>{city}</option>)}
                  </select>
                  <select className="input-editorial" value={form.category} onChange={(event) => update("category", event.target.value)}>
                    <option value="">Product category</option>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </div>
              )}
              {step === 2 && (
                <div className="grid gap-4">
                  <textarea className="input-editorial min-h-[120px] rounded-[26px]" placeholder="Product description for export buyers" value={form.productDescription} onChange={(event) => update("productDescription", event.target.value)} />
                  <div className="grid gap-4 md:grid-cols-3">
                    <input className="input-editorial" placeholder="Years in business" inputMode="numeric" value={form.yearsInBusiness} onChange={(event) => update("yearsInBusiness", event.target.value)} />
                    <input className="input-editorial" placeholder="HS code" value={form.hsCode} onChange={(event) => update("hsCode", event.target.value)} />
                    <input className="input-editorial" placeholder="Lead time, e.g. 21-35 days" value={form.leadTime} onChange={(event) => update("leadTime", event.target.value)} />
                  </div>
                  <input className="input-editorial" placeholder="Production capacity, e.g. 5,000 units/month" value={form.capacity} onChange={(event) => update("capacity", event.target.value)} />
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                    {certifications.map((item) => (
                      <label className="flex min-h-[44px] items-center gap-2 rounded-full border border-[rgba(84,98,64,0.14)] px-4 text-sm" key={item}>
                        <input type="checkbox" checked={selectedCertifications.includes(item)} onChange={() => toggleCertification(item)} />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="grid gap-4">
                  <input className="input-editorial" placeholder="Target markets, e.g. Germany, UAE, UK" value={form.targetMarkets} onChange={(event) => update("targetMarkets", event.target.value)} />
                  <input className="input-editorial" placeholder="Export countries already served, comma separated" value={form.exportCountries} onChange={(event) => update("exportCountries", event.target.value)} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <Toggle label="Has exported before" checked={form.hasExported} onChange={(value) => update("hasExported", value)} />
                    <Toggle label="Has existing buyer relationships" checked={form.hasBuyerRelationships} onChange={(value) => update("hasBuyerRelationships", value)} />
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="grid gap-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Toggle label="FBR NTN / registration available" checked={form.ntn} onChange={(value) => update("ntn", value)} />
                    <Toggle label="Export documents available" checked={form.hasExportDocs} onChange={(value) => update("hasExportDocs", value)} />
                  </div>
                  <label className="block rounded-[26px] border border-dashed border-[rgba(84,98,64,0.28)] p-5">
                    <span className="small-caps text-sm">Upload document evidence</span>
                    <input className="mt-3 input-editorial" type="file" onChange={(event) => addDocument(event.target.files)} />
                  </label>
                  {documents.length > 0 && <p className="text-sm text-[var(--ink-muted)]">Files: {documents.join(", ")}</p>}
                </div>
              )}
              {step === 5 && (
                <div className="grid gap-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Toggle label="Professional logo exists" checked={form.hasLogo} onChange={(value) => update("hasLogo", value)} />
                    <Toggle label="Consistent brand identity" checked={form.hasBrandConsistency} onChange={(value) => update("hasBrandConsistency", value)} />
                    <Toggle label="Export-ready packaging" checked={form.hasPackaging} onChange={(value) => update("hasPackaging", value)} />
                    <Toggle label="Professional product photography" checked={form.hasPhotography} onChange={(value) => update("hasPhotography", value)} />
                    <Toggle label="English catalog available" checked={form.hasEnglishCatalog} onChange={(value) => update("hasEnglishCatalog", value)} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <input className="input-editorial" placeholder="Website URL" value={form.website} onChange={(event) => update("website", event.target.value)} />
                    <input className="input-editorial" placeholder="Instagram" value={form.instagram} onChange={(event) => update("instagram", event.target.value)} />
                    <input className="input-editorial" placeholder="LinkedIn" value={form.linkedin} onChange={(event) => update("linkedin", event.target.value)} />
                  </div>
                  <input className="input-editorial" type="file" accept="image/*" onChange={(event) => addPhoto(event.target.files)} />
                  {photos.length > 0 && (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {photos.map((photo) => <figure className="rounded-[22px] border p-2" key={photo.url}><img className="aspect-square w-full rounded-[18px] object-cover" src={photo.url} alt="" /><figcaption className="mt-2 break-words text-xs">{photo.name}</figcaption></figure>)}
                    </div>
                  )}
                </div>
              )}
              {step === 6 && (
                <div className="space-y-5">
                  <p className="text-[var(--ink-muted)]">Submit the audit for {form.companyName || "your company"}. The score will decide whether the seller is approved, conditional, or not ready.</p>
                  {result && (
                    <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
                      <div className="flex h-40 w-40 items-center justify-center rounded-full border-[12px] border-[var(--forest)] bg-[var(--cream-light)]">
                        <div className="text-center"><p className="metric-numeral text-5xl">{result.score}</p><p className="small-caps text-xs">{result.status.replace("_", " ")}</p></div>
                      </div>
                      <div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {Object.entries(result.breakdown).map(([key, value]) => <div className="rounded-full border px-4 py-2 text-sm" key={key}>{scoreLabels[key]} <span className="metric-numeral float-right">{value}</span></div>)}
                        </div>
                        <p className="mt-4 rounded-[24px] border bg-[rgba(255,250,242,0.74)] p-4 leading-7">{result.feedback}</p>
                        {result.status === "conditional" && <Link className="btn-pill btn-pill-forest mt-4" href="/marketing-packages">View required marketing support</Link>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && <p className="mt-5 rounded-[22px] border border-[var(--terracotta)] bg-[rgba(201,133,103,0.10)] p-3 text-sm text-[var(--terracotta)]">{error}</p>}
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => { setError(""); setStep((current) => Math.max(1, current - 1)); }}>Back</button>
              {step < 6 ? (
                <button className="btn-pill btn-pill-forest" type="button" onClick={next}>Next</button>
              ) : (
                <button className="btn-pill btn-pill-forest" type="button" disabled={loading} onClick={submit}>{loading ? "Scoring..." : result ? "Run Again" : "Submit Audit"}</button>
              )}
            </div>
          </div>

          <aside className="panel-soft h-max p-6">
            <h2 className="text-3xl">Score weights</h2>
            <div className="mt-5 space-y-3 text-sm">
              {[
                ["Brand & Identity", "25 pts"],
                ["Digital Presence", "25 pts"],
                ["Export Experience", "20 pts"],
                ["Product Readiness", "15 pts"],
                ["Operations", "10 pts"],
                ["Compliance", "5 pts"],
              ].map(([label, points]) => <div className="flex justify-between border-b border-[rgba(84,98,64,0.12)] pb-2" key={label}><span>{label}</span><strong className="metric-numeral">{points}</strong></div>)}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex min-h-[44px] items-center justify-between gap-3 rounded-full border border-[rgba(84,98,64,0.14)] px-4 py-2 text-sm">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
