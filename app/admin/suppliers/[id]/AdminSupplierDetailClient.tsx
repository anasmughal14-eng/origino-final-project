"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Supplier } from "@/types/database";
import { writeSupplierOverride } from "@/app/components/shared/supplierOverrides";

export default function AdminSupplierDetailClient({ supplier }: { supplier: Supplier }) {
  const [form, setForm] = useState({
    company_name: supplier.company_name,
    city: supplier.city,
    category: supplier.category,
    verification_tier: supplier.verification_tier,
    is_active: supplier.is_active,
    admin_note: supplier.description ?? "",
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stamp, setStamp] = useState("");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  async function save() {
    if (!form.company_name.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!form.city.trim()) {
      toast.error("City is required");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/suppliers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: supplier.id, ...form }),
      });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Supplier update failed");
      writeSupplierOverride(supplier, {
        verification_tier: form.verification_tier,
        is_active: form.is_active,
      });
      setDirty(false);
      setStamp("Saved");
      toast.success("Supplier profile saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Supplier update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">Supplier Edit</span>
          <h1 className="mt-4 text-4xl">{supplier.company_name}</h1>
          <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">Edit verification tier, listing status, admin notes, sanctions/document readiness, and public profile routing.</p>
          {dirty && <p className="mt-3 text-sm text-[var(--terracotta)]">Unsaved changes</p>}
          {stamp && <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">{stamp}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn-pill btn-pill-outline min-h-[44px]" href="/admin/suppliers">Back to Suppliers</Link>
          <Link className="btn-pill btn-pill-outline min-h-[44px]" href={`/suppliers/${supplier.slug}`}>View Public Profile</Link>
          <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="border p-5">
          <h2 className="text-2xl">Profile Control</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">Company name</span>
              <input className="input-editorial" value={form.company_name} onChange={(event) => update("company_name", event.target.value)} />
            </label>
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">City</span>
              <input className="input-editorial" value={form.city} onChange={(event) => update("city", event.target.value)} />
            </label>
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">Category</span>
              <input className="input-editorial" value={form.category} onChange={(event) => update("category", event.target.value)} />
            </label>
            <label>
              <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">Verification tier</span>
              <select className="input-editorial" value={form.verification_tier} onChange={(event) => update("verification_tier", event.target.value as Supplier["verification_tier"])}>
                <option value="unverified">unverified</option>
                <option value="self_declared">self_declared</option>
                <option value="document_verified">document_verified</option>
                <option value="site_visited">site_visited</option>
                <option value="origino_certified">origino_certified</option>
              </select>
            </label>
            <label className="md:col-span-2">
              <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">Admin note</span>
              <textarea className="input-editorial min-h-[130px]" value={form.admin_note} onChange={(event) => update("admin_note", event.target.value)} />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => update("is_active", false)}>Suspend Listing</button>
            <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => update("is_active", true)}>Reactivate Listing</button>
            <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="border p-5">
            <h2 className="text-2xl">Compliance</h2>
            <p className="mt-3 text-sm">Sanctions: {supplier.verification_tier === "origino_certified" ? "cleared" : "review required"}</p>
            <p className="mt-2 text-sm">Documents: {supplier.certifications.join(", ") || "No certifications listed"}</p>
            <p className="mt-2 text-sm">Status: {form.is_active ? "active" : "suspended"}</p>
          </div>
          <div className="border p-5">
            <h2 className="text-2xl">Performance</h2>
            <p className="mt-3 text-sm">Response rate: {supplier.response_rate ?? 0}%</p>
            <p className="mt-2 text-sm">Health score: {supplier.health_score ?? supplier.audit_score ?? 0}</p>
            <p className="mt-2 text-sm">MOQ: ${supplier.moq_usd?.toLocaleString() ?? "0"}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
