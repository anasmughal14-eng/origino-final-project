"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SellerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    company: "",
    city: "",
    category: "",
    years: "",
    capacity: "",
  });
  const [checks, setChecks] = useState<string[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [photos, setPhotos] = useState<Array<{ name: string; url: string }>>([]);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetScore, setTargetScore] = useState(0);

  useEffect(() => {
    if (!targetScore) return;
    let value = 0;
    const increment = Math.max(1, Math.ceil(targetScore / 30));
    const timer = setInterval(() => {
      value += increment;
      setScore(Math.min(targetScore, value));
      if (value >= targetScore) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [targetScore]);

  function update(field: keyof typeof form, value: string) {
    if (error) setError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateStep() {
    if (step === 1 && (!form.company.trim() || !form.city.trim())) return "Company name and city are required.";
    if (step === 2 && (!form.category.trim() || !form.years.trim() || Number.isNaN(Number(form.years)))) return "Category and numeric years in business are required.";
    if (step === 3 && checks.length === 0) return "Select at least one certification or readiness item.";
    if (step === 4 && documents.length === 0) return "Upload at least one company document.";
    if (step === 5 && photos.length === 0) return "Upload at least one product or factory photo.";
    return "";
  }

  function next() {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep((value) => Math.min(6, value + 1));
  }

  async function submit() {
    setError("");
    setLoading(true);
    const response = await fetch("/api/submit-audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: form.company,
        city: form.city,
        category: form.category,
        yearsInBusiness: Number(form.years),
        capacity: form.capacity,
        certifications: checks,
        ntn: checks.includes("FBR NTN"),
        hasDocuments: documents.length > 0,
        hasPhotography: photos.length > 0,
      }),
    });
    const json = (await response.json()) as { success: boolean; data?: { score?: number }; score?: number; error?: string };
    setLoading(false);
    if (!json.success) {
      setError(json.error ?? "Audit submission failed.");
      return;
    }
    setTargetScore(json.data?.score ?? json.score ?? 87);
    toast.success("Audit submitted");
  }

  function addDocument(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setDocuments((list) => [...list, file.name]);
    setError("");
  }

  function addPhoto(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setPhotos((list) => [...list, { name: file.name, url: URL.createObjectURL(file) }]);
    setError("");
  }

  return (
    <div>
      <h1 className="text-4xl">Seller Onboarding</h1>
      <p className="mt-2">Step {step} of 6</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e2ddd8]">
        <div className="h-full bg-[#2d4a3e] transition-all" style={{ width: `${(step / 6) * 100}%` }} />
      </div>
      <div className="mt-6 border p-5">
        {step === 1 && (
          <div className="grid gap-3 md:grid-cols-2">
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Company name</span><input className="input-editorial" value={form.company} onChange={(event) => update("company", event.target.value)} /></label>
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">City</span><input className="input-editorial" value={form.city} onChange={(event) => update("city", event.target.value)} /></label>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-3 md:grid-cols-3">
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Product category</span><input className="input-editorial" value={form.category} onChange={(event) => update("category", event.target.value)} /></label>
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Years in business</span><input className="input-editorial" inputMode="numeric" value={form.years} onChange={(event) => update("years", event.target.value)} /></label>
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Monthly capacity</span><input className="input-editorial" value={form.capacity} onChange={(event) => update("capacity", event.target.value)} /></label>
          </div>
        )}
        {step === 3 && <div className="space-y-2">{["ISO 13485", "OEKO-TEX", "Halal", "CE", "FBR NTN"].map((item) => <label className="flex min-h-[44px] items-center gap-2" key={item}><input type="checkbox" checked={checks.includes(item)} onChange={() => { setError(""); setChecks((list) => list.includes(item) ? list.filter((x) => x !== item) : [...list, item]); }} />{item}</label>)}</div>}
        {step === 4 && <div><input type="file" className="input-editorial" onChange={(event) => addDocument(event.target.files)} />{documents.length > 0 && <p className="mt-3 text-sm text-[#5a5a54]">Documents: {documents.join(", ")}</p>}</div>}
        {step === 5 && <div><input type="file" accept="image/*" className="input-editorial" onChange={(event) => addPhoto(event.target.files)} />{photos.length > 0 && <div className="mt-4 grid gap-3 sm:grid-cols-3">{photos.map((photo) => <figure className="border p-2" key={photo.url}><img className="aspect-square w-full object-cover" src={photo.url} alt="" /><figcaption className="mt-2 break-words text-xs text-[#5a5a54]">{photo.name}</figcaption></figure>)}</div>}</div>}
        {step === 6 && <div><p>Ready to submit audit for {form.company || "your company"}.</p>{score > 0 && <div className="mt-5 flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#2d4a3e] metric-numeral text-3xl">{score}</div>}</div>}
        {error && <p className="mt-4 text-sm text-[#c0623a]">{error}</p>}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => { setError(""); setStep((value) => Math.max(1, value - 1)); }}>Back</button>
        {step < 6 ? <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={next}>Next</button> : <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={submit} disabled={loading}>{loading ? "Submitting..." : "Submit Audit"}</button>}
      </div>
    </div>
  );
}
