"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { Supplier } from "@/types/database";
import { applySupplierOverrides, writeSupplierOverride } from "@/app/components/shared/supplierOverrides";

export default function AdminSuppliersClient({ suppliers }: { suppliers: Supplier[] }) {
  const [items, setItems] = useState(() => applySupplierOverrides(suppliers));
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [tier, setTier] = useState<Supplier["verification_tier"] | "all">("all");
  const [loadingId, setLoadingId] = useState("");
  const [stampId, setStampId] = useState("");

  const cities = useMemo(() => Array.from(new Set(items.map((item) => item.city))), [items]);
  const filtered = useMemo(() => items.filter((supplier) => {
    const haystack = `${supplier.company_name} ${supplier.city} ${supplier.category} ${supplier.certifications.join(" ")}`.toLowerCase();
    return (!query || haystack.includes(query.toLowerCase()))
      && (city === "all" || supplier.city === city)
      && (tier === "all" || supplier.verification_tier === tier);
  }), [city, items, query, tier]);

  async function patchSupplier(id: string, update: Partial<Supplier>, message: string) {
    setLoadingId(id);
    try {
      const response = await fetch("/api/admin/suppliers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...update }),
      });
      const payload = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Supplier update failed");
      const currentSupplier = items.find((supplier) => supplier.id === id);
      if (currentSupplier) writeSupplierOverride(currentSupplier, update);
      setItems((list) => list.map((supplier) => supplier.id === id ? { ...supplier, ...update } : supplier));
      setStampId(id);
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Supplier update failed");
    } finally {
      setLoadingId("");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">Supplier Control</span>
          <h1 className="mt-4 text-4xl">Suppliers</h1>
          <p className="mt-2 max-w-3xl text-[var(--ink-soft)]">Search suppliers, change verification tiers inline, suspend/reactivate listings, and open the full edit record.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-right">
          <div><p className="metric-numeral text-3xl">{items.length}</p><p className="small-caps text-sm">Suppliers</p></div>
          <div><p className="metric-numeral text-3xl">{items.filter((item) => item.is_active).length}</p><p className="small-caps text-sm">Active</p></div>
          <div><p className="metric-numeral text-3xl">{items.filter((item) => item.verification_tier === "origino_certified").length}</p><p className="small-caps text-sm">Certified</p></div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        <input className="input-editorial" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search supplier, category, certification" />
        <select className="input-editorial" value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="all">All cities</option>
          {cities.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select className="input-editorial" value={tier} onChange={(event) => setTier(event.target.value as Supplier["verification_tier"] | "all")}>
          <option value="all">All tiers</option>
          <option value="unverified">unverified</option>
          <option value="self_declared">self_declared</option>
          <option value="document_verified">document_verified</option>
          <option value="site_visited">site_visited</option>
          <option value="origino_certified">origino_certified</option>
        </select>
      </div>

      <div className="mt-8 overflow-x-auto border">
        <table className="w-full min-w-[1050px] border-collapse text-sm">
          <thead className="border-b bg-[var(--cream)] text-left">
            <tr>
              <th className="p-4">Supplier</th>
              <th className="p-4">Cluster</th>
              <th className="p-4">Category</th>
              <th className="p-4">Verification Tier</th>
              <th className="p-4">Health</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((supplier) => (
              <tr className="border-b align-top" key={supplier.id}>
                <td className="p-4">
                  <p className="font-semibold">{supplier.company_name}</p>
                  <p className="text-xs text-[var(--ink-muted)]">{supplier.slug}</p>
                  {stampId === supplier.id && <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--forest)]">Updated</p>}
                </td>
                <td className="p-4">{supplier.city}</td>
                <td className="p-4">{supplier.category}</td>
                <td className="p-4">
                  <select className="input-editorial min-w-[190px]" value={supplier.verification_tier} onChange={(event) => patchSupplier(supplier.id, { verification_tier: event.target.value as Supplier["verification_tier"] }, "Verification tier updated")} disabled={loadingId === supplier.id}>
                    <option value="unverified">unverified</option>
                    <option value="self_declared">self_declared</option>
                    <option value="document_verified">document_verified</option>
                    <option value="site_visited">site_visited</option>
                    <option value="origino_certified">origino_certified</option>
                  </select>
                </td>
                <td className="p-4"><span className="metric-numeral text-xl">{supplier.health_score ?? supplier.audit_score ?? 0}</span></td>
                <td className="p-4"><span className="badge-patch">{supplier.is_active ? "active" : "suspended"}</span></td>
                <td className="p-4">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link className="btn-pill btn-pill-outline min-h-[44px]" href={`/admin/suppliers/${supplier.id}`}>Edit</Link>
                    <Link className="btn-pill btn-pill-outline min-h-[44px]" href={`/suppliers/${supplier.slug}`}>Public Profile</Link>
                    <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => patchSupplier(supplier.id, { is_active: !supplier.is_active }, supplier.is_active ? "Supplier suspended" : "Supplier reactivated")} disabled={loadingId === supplier.id}>{supplier.is_active ? "Suspend" : "Reactivate"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && <div className="mt-6 border p-6 text-center">No suppliers match this filter.</div>}
    </div>
  );
}
