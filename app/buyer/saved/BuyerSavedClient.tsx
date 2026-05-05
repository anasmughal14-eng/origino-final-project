"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Product, Supplier } from "@/types/database";

export default function BuyerSavedClient({ suppliers, products }: { suppliers: Supplier[]; products: Product[] }) {
  const [supplierItems, setSupplierItems] = useState(() => suppliers);
  const [productItems, setProductItems] = useState(() => products);
  function removeSupplier(id: string) {
    setSupplierItems((list) => list.filter((item) => item.id !== id));
    toast.success("Supplier removed from saved list");
  }
  function removeProduct(id: string) {
    setProductItems((list) => list.filter((item) => item.id !== id));
    toast.success("Product removed from saved list");
  }
  return <div><div className="border-b border-[rgba(26,26,24,0.12)] pb-6"><p className="badge-patch mb-3">Buyer shortlist</p><h1 className="text-4xl">Saved Items</h1><p className="mt-2 text-sm text-[#5a5a54]">Saved suppliers and products remain local before Supabase saved_items is connected.</p></div><h2 className="mt-6 text-2xl">Suppliers</h2>{supplierItems.length === 0 && <div className="mt-3 border border-dashed p-5 text-sm text-[#5a5a54]">No saved suppliers remain.</div>}{supplierItems.map((supplier) => <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border p-4" key={supplier.id}><div><Link className="font-semibold hover:underline" href={`/suppliers/${supplier.slug}`}>{supplier.company_name}</Link><p className="mt-1 text-sm text-[#5a5a54]">{supplier.city} / {supplier.category}</p></div><div className="flex flex-wrap gap-2"><Link className="btn-pill btn-pill-forest min-h-[44px]" href={`/suppliers/${supplier.slug}`}>View</Link><button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => removeSupplier(supplier.id)}>Remove</button></div></div>)}<h2 className="mt-6 text-2xl">Products</h2>{productItems.length === 0 && <div className="mt-3 border border-dashed p-5 text-sm text-[#5a5a54]">No saved products remain.</div>}{productItems.map((product) => <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border p-4" key={product.id}><div><Link className="font-semibold hover:underline" href={`/products/${product.slug}`}>{product.name}</Link><p className="mt-1 text-sm text-[#5a5a54]">{product.category} / MOQ {product.moq.toLocaleString()} {product.moq_unit}</p></div><div className="flex flex-wrap gap-2"><Link className="btn-pill btn-pill-forest min-h-[44px]" href={`/products/${product.slug}`}>View</Link><button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => removeProduct(product.id)}>Remove</button></div></div>)}</div>;
}
