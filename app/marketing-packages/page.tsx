import Link from "next/link";

const packages = [
  {
    name: "Basic",
    price: "$299",
    delivery: "3 weeks",
    summary: "Brand readiness for manufacturers who need a credible first export profile.",
    features: [
      "Brand audit and 1 hour consultation call",
      "Professional logo design with 3 concepts",
      "Business card and letterhead design",
      "LinkedIn and Instagram profile setup",
      "1 page English product overview PDF",
      "Basic ORIGINO marketplace listing",
    ],
  },
  {
    name: "Growth",
    price: "$799",
    delivery: "6 weeks",
    summary: "Most popular export launch package for sellers who need buyer-ready assets.",
    featured: true,
    features: [
      "Everything in Basic",
      "Product photography for up to 10 products, 3 images each",
      "5 page English, SEO-optimised company website",
      "HS code and incoterms export documentation guide",
      "2 social content packs, 10 posts each",
      "Full profile, featured badge, and buyer-network email campaign",
    ],
  },
  {
    name: "Premium",
    price: "$1,999",
    delivery: "10 weeks",
    summary: "Full export acceleration for sellers ready for direct buyer introductions.",
    features: [
      "Everything in Growth",
      "Full product photography for unlimited products",
      "2-3 minute brand video and company story film",
      "Full website with unlimited product catalog pages",
      "ORIGINO export readiness certification",
      "Dedicated account manager for 3 months",
      "Direct introductions to 5 vetted buyers",
      "Priority listing with sponsored badge and 3 monthly analytics reports",
    ],
  },
];

const paymentOptions = [
  "Stripe for international cards",
  "JazzCash in PKR equivalent",
  "EasyPaisa in PKR equivalent",
  "Bank transfer with ORIGINO reference code",
];

export default function MarketingPackagesPage() {
  return (
    <div className="page-enter pt-28">
      <section className="container-editorial pb-16">
        <div className="max-w-3xl">
          <p className="badge-patch tier-certified mb-5">Seller Growth Services</p>
          <h1 className="text-5xl md:text-7xl">Turn your factory into a buyer-ready export brand.</h1>
          <p className="mt-5 text-lg leading-8 text-[#5a5a54]">
            Basic, Growth, and Premium are the main paid services for Pakistani manufacturers who need export-grade branding, photography, catalogues, websites, and buyer-introduction support. The audit still protects marketplace quality; these packages make the seller ready to pass it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-pill btn-pill-forest min-h-[44px]" href="/audit">
              Start AI Audit First
            </Link>
            <Link className="btn-pill btn-pill-outline min-h-[44px]" href="/login?redirect=/seller/marketing">
              Seller Sign In
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {packages.map((tier) => (
            <article id={tier.name.toLowerCase()} className={`dashboard-card flex flex-col p-6 ${tier.featured ? "border-[#2d4a3e] bg-[#e8f0ec]" : ""}`} key={tier.name}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-3xl">{tier.name}</h2>
                  <p className="mt-2 text-sm text-[#5a5a54]">{tier.summary}</p>
                </div>
                {tier.featured && <span className="badge-patch">Most Popular</span>}
              </div>
              <p className="metric-numeral mt-6 text-4xl">{tier.price}</p>
              <p className="mt-1 text-sm text-[#5a5a54]">Delivery: {tier.delivery}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm leading-6 text-[#3a3a38]">
                {tier.features.map((feature) => (
                  <li className="border-t border-[#e2ddd8] pt-3" key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                className="btn-pill btn-pill-forest mt-6 min-h-[44px] justify-center"
                href={`/register?role=seller&package=${tier.name.toLowerCase()}&redirect=${encodeURIComponent(`/checkout/marketing?package=${tier.name.toLowerCase()}`)}`}
              >
                Buy {tier.name} Package
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <section className="dashboard-card p-6">
            <h2 className="text-3xl">Payment Options</h2>
            <p className="mt-3 text-sm leading-6 text-[#5a5a54]">
              The original spec requires Pakistan-friendly payments plus international card checkout. PKR pricing is calculated from USD using the stored exchange rate with a 2% buffer once live exchange rates are connected.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((option) => <div className="dashboard-card p-4 text-sm" key={option}>{option}</div>)}
            </div>
          </section>

          <section className="dashboard-card p-6">
            <h2 className="text-3xl">Milestones & SLA</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-[#3a3a38]">
              <p>Growth and Premium use milestone payments: 50% at checkout and 50% when deliverables are marked received.</p>
              <p>Each paid order receives an SLA due date based on package delivery time. Overdue work is flagged for admin follow-up and seller notification.</p>
              <p>Package purchase does not skip verification. Sellers still complete the audit and document checks before public approval.</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
