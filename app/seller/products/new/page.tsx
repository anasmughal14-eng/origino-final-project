"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

type ProductDraft = {
  name: string;
  category: string;
  subcategory: string;
  priceMin: string;
  priceMax: string;
  moq: string;
  leadTime: string;
  hsCode: string;
  incoterms: string[];
  sampleAvailable: boolean;
  specifications: string;
};

const blankDraft: ProductDraft = {
  name: "",
  category: "",
  subcategory: "",
  priceMin: "",
  priceMax: "",
  moq: "",
  leadTime: "",
  hsCode: "",
  incoterms: ["FOB"],
  sampleAvailable: true,
  specifications: "",
};

export default function SellerNewProductPage() {
  const [draft, setDraft] = useState(blankDraft);
  const [imageName, setImageName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof ProductDraft, value: string | boolean | string[]) {
    setError("");
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function toggleIncoterm(term: string) {
    update(
      "incoterms",
      draft.incoterms.includes(term) ? draft.incoterms.filter((item) => item !== term) : [...draft.incoterms, term],
    );
  }

  function saveProduct() {
    if (!draft.name.trim() || !draft.category.trim() || !draft.priceMin || !draft.priceMax || !draft.moq || !draft.leadTime) {
      setError("Name, category, price range, MOQ, and lead time are required.");
      return;
    }
    if ([draft.priceMin, draft.priceMax, draft.moq].some((value) => Number.isNaN(Number(value)))) {
      setError("Price and MOQ fields must be numeric.");
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setDraft(blankDraft);
      setImageName("");
      toast.success("Product draft saved for catalog review.");
    }, 600);
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Product catalog</span>
          <h1>New Product</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Add product basics, pricing, incoterms, images, and specifications for buyer-facing catalog pages.
          </p>
        </div>
        <Link className="btn-pill btn-pill-outline" href="/seller/products">
          Back to Products
        </Link>
      </section>

      <section className="border p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">Product name</span>
            <input className="input-editorial mt-2" value={draft.name} onChange={(event) => update("name", event.target.value)} />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">Category</span>
            <input className="input-editorial mt-2" value={draft.category} onChange={(event) => update("category", event.target.value)} />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">Subcategory</span>
            <input className="input-editorial mt-2" value={draft.subcategory} onChange={(event) => update("subcategory", event.target.value)} />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">HS code</span>
            <input className="input-editorial mt-2" value={draft.hsCode} onChange={(event) => update("hsCode", event.target.value)} />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">Minimum price USD</span>
            <input className="input-editorial mt-2" inputMode="decimal" value={draft.priceMin} onChange={(event) => update("priceMin", event.target.value)} />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">Maximum price USD</span>
            <input className="input-editorial mt-2" inputMode="decimal" value={draft.priceMax} onChange={(event) => update("priceMax", event.target.value)} />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">MOQ</span>
            <input className="input-editorial mt-2" inputMode="numeric" value={draft.moq} onChange={(event) => update("moq", event.target.value)} />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">Lead time</span>
            <input className="input-editorial mt-2" value={draft.leadTime} onChange={(event) => update("leadTime", event.target.value)} />
          </label>
        </div>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">Incoterms</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {["FOB", "CIF", "EXW"].map((term) => (
              <label className="btn-pill btn-pill-outline min-h-11" key={term}>
                <input className="sr-only" checked={draft.incoterms.includes(term)} type="checkbox" onChange={() => toggleIncoterm(term)} />
                {draft.incoterms.includes(term) ? `${term} selected` : term}
              </label>
            ))}
          </div>
        </div>

        <label className="mt-5 flex min-h-11 items-center gap-3">
          <input checked={draft.sampleAvailable} type="checkbox" onChange={(event) => update("sampleAvailable", event.target.checked)} />
          <span>Sample available</span>
        </label>

        <label className="mt-5 block">
          <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">Product image</span>
          <input
            className="input-editorial mt-2"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setImageName(event.target.files?.[0]?.name ?? "")}
          />
          {imageName ? <span className="mt-2 block text-sm text-forest">Selected: {imageName}</span> : null}
        </label>

        <label className="mt-5 block">
          <span className="text-xs uppercase tracking-[0.24em] text-ink-muted">Specifications</span>
          <textarea
            className="input-editorial mt-2 min-h-36"
            value={draft.specifications}
            onChange={(event) => update("specifications", event.target.value)}
            placeholder="Material, size, finish, packaging, certifications"
          />
        </label>

        {error ? <p className="mt-4 text-sm text-terracotta">{error}</p> : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="btn-pill btn-pill-forest" type="button" onClick={saveProduct} disabled={saving}>
            {saving ? "Saving..." : "Save Product"}
          </button>
          <button className="btn-pill btn-pill-outline" type="button" onClick={() => setDraft(blankDraft)}>
            Reset
          </button>
        </div>
      </section>
    </div>
  );
}
