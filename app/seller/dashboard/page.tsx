import Link from "next/link";
import { getInquiries, getOrders, getQuotes, getSuppliers } from "@/lib/data-service";

export default async function SellerDashboardPage() {
  const [suppliers, inquiries, quotes, orders] = await Promise.all([getSuppliers(), getInquiries(), getQuotes(), getOrders()]);
  const supplier = suppliers[0];
  const sellerInquiries = inquiries.filter((item) => item.supplier_id === supplier.id);
  const sellerOrders = orders.filter((order) => order.supplier_id === supplier.id);
  const sellerQuotes = quotes.filter((quote) => quote.supplier_id === supplier.id);
  const revenue30d = sellerOrders.reduce((total, order) => total + order.total_usd, 0);
  const healthScore = supplier.health_score ?? 0;
  const responseRate = supplier.response_rate ?? 0;
  const responseHours = supplier.response_time_hours ?? 0;

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-[rgba(26,26,24,0.12)] pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="badge-patch mb-3">Seller Portal</p>
          <h1 className="text-4xl">Dashboard</h1>
          <p className="mt-2 text-[#5a5a54]">{supplier.company_name} / {supplier.city}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn-pill btn-pill-outline min-h-[44px]" href="/seller/onboarding">Continue Onboarding</Link>
          <Link className="btn-pill btn-pill-forest min-h-[44px]" href="/seller/inquiries">View All Inquiries</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{sellerInquiries.length}</p><p className="text-sm text-[#5a5a54]">Open inquiries</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{sellerQuotes.length}</p><p className="text-sm text-[#5a5a54]">Active quotes</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{sellerOrders.length}</p><p className="text-sm text-[#5a5a54]">Orders</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{healthScore}%</p><p className="text-sm text-[#5a5a54]">Health score</p><div className="progress-track mt-3"><div className="progress-fill transition-all duration-1000" style={{ width: `${healthScore}%` }} /></div></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{responseRate}%</p><p className="text-sm text-[#5a5a54]">Response rate 30d</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">{responseHours}h</p><p className="text-sm text-[#5a5a54]">Avg response time</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">1,240</p><p className="text-sm text-[#5a5a54]">Profile views 30d</p></div>
        <div className="dashboard-card p-5"><p className="metric-numeral text-3xl">${revenue30d.toLocaleString()}</p><p className="text-sm text-[#5a5a54]">Revenue 30d</p></div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="dashboard-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl">Recent Buyer Inquiries</h2>
            <span className="badge-patch">Intent visible to seller</span>
          </div>
          <div className="mt-4 space-y-3">
            {sellerInquiries.map((inquiry) => (
              <Link className="dashboard-card block p-4" key={inquiry.id} href={`/seller/inquiries?inquiry=${inquiry.id}`}>
                <div className="flex justify-between gap-3">
                  <p className="font-semibold">{inquiry.subject}</p>
                  <span className="badge-patch">{inquiry.intent_score}</span>
                </div>
                <p className="mt-2 text-sm text-[#5a5a54]">{inquiry.buyer_company} / {inquiry.quantity.toLocaleString()} units</p>
              </Link>
            ))}
          </div>
        </section>
        <aside className="dashboard-card bg-[rgba(255,250,242,0.72)] p-5">
          <h2 className="text-2xl">Profile Health</h2>
          {["Documents", "Product catalog", "Response speed"].map((item, index) => (
            <div className="mt-4" key={item}>
              <div className="flex justify-between text-sm"><span>{item}</span><span className="metric-numeral">{[92, 78, 96][index]}%</span></div>
              <div className="progress-track mt-2"><div className="progress-fill transition-all duration-1000" style={{ width: `${[92, 78, 96][index]}%` }} /></div>
            </div>
          ))}
          <Link className="btn-pill btn-pill-outline mt-5 min-h-[44px] w-full" href="/seller/performance">Open Performance</Link>
        </aside>
      </div>
    </div>
  );
}
