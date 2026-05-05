import Link from "next/link";
import SupplierVerificationBadgeClient from "@/app/components/shared/SupplierVerificationBadgeClient";
import { getOrders, getQuotes, getSuppliers } from "@/lib/data-service";

export default async function BuyerDashboardPage() {
  const [suppliers, orders, quotes] = await Promise.all([getSuppliers(), getOrders(), getQuotes()]);
  const recommended = suppliers.slice(0, 3);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-[rgba(26,26,24,0.12)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="badge-patch mb-3">Buyer Portal</p>
          <h1 className="text-4xl">Dashboard</h1>
          <p className="mt-2 text-[#5a5a54]">Recommended suppliers, live quote activity, and order tracking in one desk.</p>
        </div>
        <Link className="btn-pill btn-pill-forest min-h-[44px]" href="/marketplace">Browse Marketplace</Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{orders.length}</p><p className="text-sm text-[#5a5a54]">Tracked orders</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{quotes.length}</p><p className="text-sm text-[#5a5a54]">Quotes received</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{recommended.length}</p><p className="text-sm text-[#5a5a54]">Recommended suppliers</p></div>
      </div>

      <h2 className="mt-8 text-3xl">Recommended Suppliers</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {recommended.map((supplier) => (
          <Link className="dashboard-card p-5" key={supplier.id} href={`/suppliers/${supplier.slug}`}>
            <SupplierVerificationBadgeClient supplierId={supplier.id} tier={supplier.verification_tier} />
            <h3 className="mt-4 text-2xl">{supplier.company_name}</h3>
            <p className="mt-2 text-sm text-[#5a5a54]">{supplier.city} / {supplier.category}</p>
            <p className="mt-4 metric-numeral text-sm">Response {supplier.response_rate}%</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

