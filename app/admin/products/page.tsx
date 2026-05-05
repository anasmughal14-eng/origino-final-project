import Link from "next/link";
import { getProducts, getSuppliers } from "@/lib/data-service";

export default async function AdminProductsPage() {
  const [products, suppliers] = await Promise.all([getProducts(), getSuppliers()]);
  const supplierById = new Map(suppliers.map((supplier) => [supplier.id, supplier.company_name]));
  const sensitiveCount = products.filter((product) => product.specifications && Object.keys(product.specifications).length > 3).length;

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Catalog moderation</span>
          <h1>Products</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Review product catalog records, NDA flags, availability, samples, and buyer-facing profile links.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="border p-5">
          <p className="metric-text text-3xl">{products.length}</p>
          <p className="mt-2 text-ink-soft">Products</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">{products.filter((product) => product.is_active).length}</p>
          <p className="mt-2 text-ink-soft">Active</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">{sensitiveCount}</p>
          <p className="mt-2 text-ink-soft">NDA flagged</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">{products.filter((product) => product.sample_available).length}</p>
          <p className="mt-2 text-ink-soft">Samples</p>
        </div>
      </section>

      <section className="border">
        <div className="grid gap-3 border-b bg-cream p-4 font-semibold lg:grid-cols-[1fr_1fr_auto_auto_auto]">
          <span>Product</span>
          <span>Supplier</span>
          <span>Price</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="divide-y">
          {products.map((product) => (
            <div className="grid gap-3 p-4 lg:grid-cols-[1fr_1fr_auto_auto_auto]" key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <p className="text-sm text-ink-muted">
                  {product.category} / {product.hs_code}
                </p>
              </div>
              <span>{supplierById.get(product.supplier_id) ?? "Unknown supplier"}</span>
              <span className="metric-text">
                ${product.price_usd_min} - ${product.price_usd_max}
              </span>
              <div className="flex flex-wrap gap-2">
                <span className="badge-patch">{product.is_active ? "active" : "inactive"}</span>
                {product.specifications && Object.keys(product.specifications).length > 3 ? <span className="badge-patch">Specs</span> : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link className="btn-pill btn-pill-outline" href={`/products/${product.slug}`}>
                  Public Page
                </Link>
                <Link className="btn-pill btn-pill-outline" href={`/admin/suppliers/${product.supplier_id}`}>
                  Supplier
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
