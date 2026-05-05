"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { readSellerProducts, saveSellerProducts } from "@/app/components/shared/sellerMockStore";
import type { Product } from "@/types/database";

type ProductForm = {
  id?: string;
  name: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  moq: string;
  active: boolean;
};

function formFromProduct(product?: Product): ProductForm {
  return {
    id: product?.id,
    name: product?.name ?? "",
    category: product?.category ?? "",
    minPrice: String(product?.price_usd_min ?? ""),
    maxPrice: String(product?.price_usd_max ?? ""),
    moq: String(product?.moq ?? ""),
    active: product?.is_active ?? true,
  };
}

export default function SellerProductsClient({ products }: { products: Product[] }) {
  const [items, setItems] = useState(products);
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(readSellerProducts(products));
  }, [products]);

  async function save() {
    if (!editing) return;
    if (!editing.name.trim() || !editing.category.trim()) {
      setError("Product name and category are required.");
      return;
    }
    if (Number.isNaN(Number(editing.minPrice)) || Number.isNaN(Number(editing.maxPrice))) {
      setError("Prices must be numeric.");
      return;
    }

    const existing = items.find((item) => item.id === editing.id);
    if (existing) {
      const optimistic = {
        ...existing,
        name: editing.name,
        category: editing.category,
        price_usd_min: Number(editing.minPrice),
        price_usd_max: Number(editing.maxPrice),
        moq: Number(editing.moq) || existing.moq,
        is_active: editing.active,
      };
      const response = await fetch("/api/seller/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editing.id,
          name: editing.name,
          category: editing.category,
          minPrice: editing.minPrice,
          maxPrice: editing.maxPrice,
          moq: editing.moq,
          active: editing.active,
        }),
      });
      const payload = await response.json() as { success: boolean; data?: { product?: Product }; error?: string };
      if (!payload.success) {
        setError(payload.error ?? "Product could not be saved.");
        return;
      }
      const savedProduct = payload.data?.product ?? optimistic;
      const nextItems = items.map((item) => item.id === editing.id ? {
        ...item,
        ...savedProduct,
      } : item);
      setItems(nextItems);
      saveSellerProducts(nextItems);
    } else {
      const base = items[0];
      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: base?.supplier_id,
          name: editing.name,
          category: editing.category,
          minPrice: editing.minPrice,
          maxPrice: editing.maxPrice,
          moq: editing.moq,
          active: editing.active,
        }),
      });
      const payload = await response.json() as { success: boolean; data?: { product?: Product }; error?: string };
      if (!payload.success) {
        setError(payload.error ?? "Product could not be saved.");
        return;
      }
      const created = payload.data?.product ?? {
        ...base,
        id: `prod-local-${Date.now()}`,
        slug: editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        name: editing.name,
        category: editing.category,
        price_usd_min: Number(editing.minPrice),
        price_usd_max: Number(editing.maxPrice),
        moq: Number(editing.moq) || 1,
        is_active: editing.active,
      };
      const nextItems = [created as Product, ...items];
      setItems(nextItems);
      saveSellerProducts(nextItems);
    }
    setEditing(null);
    setError("");
    toast.success("Product saved");
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-4">
        <h1 className="text-4xl">Products</h1>
        <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => { setError(""); setEditing(formFromProduct()); }}>Add Product</button>
      </div>
      <div className="mt-6 space-y-3">
        {items.map((product) => (
          <div className="flex flex-wrap items-center justify-between gap-3 border p-4" key={product.id}>
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="metric-numeral text-sm">${product.price_usd_min} - ${product.price_usd_max}</p>
              <span className="badge-patch mt-2">{product.is_active ? "Active" : "Inactive"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => { setError(""); setEditing(formFromProduct(product)); }}>Edit</button>
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={async () => {
                const active = !product.is_active;
                const response = await fetch("/api/seller/products", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productId: product.id, active }),
                });
                const payload = await response.json() as { success: boolean; data?: { product?: Product }; error?: string };
                if (!payload.success) {
                  toast.error(payload.error ?? "Product status could not be updated");
                  return;
                }
                const nextItems = items.map((item) => item.id === product.id ? { ...item, ...(payload.data?.product ?? {}), is_active: active } : item);
                setItems(nextItems);
                saveSellerProducts(nextItems);
                toast.success("Product status updated");
              }}>{product.is_active ? "Set inactive" : "Set active"}</button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,26,24,0.45)] p-4">
          <div className="modal-surface max-h-[90vh] w-full max-w-3xl overflow-y-auto">
            <p className="badge-patch mb-4">{editing.id ? "Product editor" : "New product"}</p>
            <h2 className="text-3xl">{editing.id ? "Edit Product" : "Add Product"}</h2>
            <p className="mt-2 text-sm text-[#5a5a54]">This form saves to Supabase in live mode and keeps local continuity in mock mode.</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Name</span><input className="input-editorial" value={editing.name} onChange={(event) => { setError(""); setEditing({ ...editing, name: event.target.value }); }} /></label>
              <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Category</span><input className="input-editorial" value={editing.category} onChange={(event) => { setError(""); setEditing({ ...editing, category: event.target.value }); }} /></label>
              <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Minimum price</span><input className="input-editorial" inputMode="decimal" value={editing.minPrice} onChange={(event) => { setError(""); setEditing({ ...editing, minPrice: event.target.value }); }} /></label>
              <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Maximum price</span><input className="input-editorial" inputMode="decimal" value={editing.maxPrice} onChange={(event) => { setError(""); setEditing({ ...editing, maxPrice: event.target.value }); }} /></label>
              <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">MOQ</span><input className="input-editorial" inputMode="numeric" value={editing.moq} onChange={(event) => setEditing({ ...editing, moq: event.target.value })} /></label>
              <label className="flex min-h-[44px] items-center gap-2 pt-5"><input type="checkbox" checked={editing.active} onChange={(event) => setEditing({ ...editing, active: event.target.checked })} /> Active listing</label>
            </div>
            {error && <p className="mt-3 text-sm text-[#c0623a]">{error}</p>}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => void save()}>Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
