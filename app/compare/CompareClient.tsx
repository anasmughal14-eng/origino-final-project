"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SupplierVerificationBadgeClient from "@/app/components/shared/SupplierVerificationBadgeClient";
import { applySupplierOverrides } from "@/app/components/shared/supplierOverrides";
import type { Supplier } from "@/types/database";

export default function CompareClient({ suppliers, initialIds }: { suppliers: Supplier[]; initialIds: string[] }) {
  const [effectiveSuppliers, setEffectiveSuppliers] = useState(() => applySupplierOverrides(suppliers));
  const [selected, setSelected] = useState<string[]>(initialIds.slice(0, 3));
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
  const selectedSuppliers = effectiveSuppliers.filter((supplier) => supplier.is_active && selected.includes(supplier.id));
  function add(id: string) {
    setSelected((current) => current.includes(id) ? current : [...current, id].slice(0, 3));
  }
  return (
    <div className="container-editorial pt-28 pb-16">
      <h1 className="text-5xl">Compare Suppliers</h1>
      <p className="mt-3 text-[#5a5a54]">Select up to three suppliers for a side-by-side readiness check.</p>
      <div className="mt-6 flex flex-wrap gap-2">{effectiveSuppliers.filter((supplier) => supplier.is_active).map((supplier) => <button className="btn-pill btn-pill-outline min-h-[44px]" key={supplier.id} onClick={() => add(supplier.id)} disabled={selected.includes(supplier.id)}>{supplier.company_name}</button>)}</div>
      {selectedSuppliers.length === 0 && <div className="mt-8 border border-[rgba(26,26,24,0.16)] p-6 text-[#5a5a54]">Choose a supplier above to start comparing.</div>}
      {selectedSuppliers.length > 0 && <div className="mt-8 overflow-x-auto border border-[rgba(26,26,24,0.16)]">
        <table className="min-w-full text-sm">
          <thead><tr>{["Attribute", ...selectedSuppliers.map((supplier) => supplier.company_name)].map((item) => <th className="border-b p-3 text-start" key={item}>{item}</th>)}</tr></thead>
          <tbody>{["city", "category", "verification_tier", "certifications", "response_rate", "moq_usd", "lead_time_days"].map((field) => <tr key={field}><th className="border-b p-3 text-start">{field.replaceAll("_", " ")}</th>{selectedSuppliers.map((supplier) => <td className="border-b p-3" key={supplier.id}>{field === "verification_tier" ? <SupplierVerificationBadgeClient supplierId={supplier.id} tier={supplier.verification_tier} /> : Array.isArray(supplier[field as keyof Supplier]) ? (supplier[field as keyof Supplier] as string[]).join(", ") : String(supplier[field as keyof Supplier] ?? "")}</td>)}</tr>)}</tbody>
        </table>
      </div>}
      <div className="mt-5 flex flex-wrap gap-3">{selectedSuppliers.map((supplier) => <div key={supplier.id} className="flex gap-2"><Link className="btn-pill btn-pill-forest min-h-[44px]" href={`/suppliers/${supplier.slug}`}>View Profile</Link><button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setSelected((current) => current.filter((id) => id !== supplier.id))}>Remove</button></div>)}</div>
    </div>
  );
}
