import Link from "next/link";
import { getSuppliers } from "@/lib/data-service";

export default async function BuyerMarketplacePage() {
  const recommended = (await getSuppliers()).slice(0, 4);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">BUYER SOURCING</span>
          <h1 className="mt-4 text-4xl">Marketplace</h1>
          <p className="mt-3 max-w-3xl text-[#5a5a54]">Start from recommended verified suppliers, then move into the full faceted marketplace with buyer context.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="btn-pill btn-pill-forest" href="/marketplace">Open Full Marketplace</Link>
          <Link className="btn-pill btn-pill-outline" href="/buyer/saved-searches">Saved Searches</Link>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {recommended.map((supplier) => (
          <Link className="block border border-[#e2ddd8] p-5 transition hover:border-[#2d4a3e]" href={`/suppliers/${supplier.slug}`} key={supplier.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl">{supplier.company_name}</h2>
                <p className="mt-1 text-sm text-[#5a5a54]">{supplier.city} / {supplier.category}</p>
              </div>
              <span className="badge-patch">{supplier.verification_tier.replaceAll("_", " ")}</span>
            </div>
            <p className="mt-4 text-[#5a5a54]">{supplier.description}</p>
            <p className="metric-numeral mt-4">Response {supplier.response_rate}% / MOQ ${supplier.moq_usd?.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
