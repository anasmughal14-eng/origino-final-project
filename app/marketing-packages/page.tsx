import Link from "next/link";

const packages = [
  {
    name: "Basic",
    price: "$299",
    delivery: "3 weeks",
    summary: "A first layer of identity and export presentation.",
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
    summary: "A stronger visibility layer for manufacturers ready to grow.",
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
    summary: "Story, catalogue, and buyer introductions for serious export intent.",
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
          <h1 className="text-[2.8rem] leading-[0.98] md:text-[4.4rem]">Keep making well. We help the right buyers see it clearly.</h1>
          <p className="mt-5 text-lg leading-8 text-[#5a5a54]">
            Many Pakistani manufacturers already make well. The gap is usually not production. It is visibility, presentation, documentation, and buyer confidence. ORIGINO handles that layer so manufacturers can stay focused on the work itself.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-pill btn-pill-forest min-h-[44px]" href="#packages">
              Choose support
            </Link>
            <Link className="btn-pill btn-pill-outline min-h-[44px]" href="/audit">
              Run readiness audit
            </Link>
          </div>
        </div>

        <div id="packages" className="mt-12 grid scroll-mt-28 gap-5 lg:grid-cols-3">
          {packages.map((tier) => (
            <article id={tier.name.toLowerCase()} className={`panel-soft flex flex-col p-6 ${tier.featured ? "border-[rgba(84,98,64,0.28)] bg-[rgba(238,240,227,0.56)]" : ""}`} key={tier.name}>
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
                Select {tier.name}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <section className="panel-soft p-6">
            <h2 className="text-3xl">Payment options</h2>
            <p className="mt-3 text-sm leading-6 text-[#5a5a54]">
              International cards, local wallets, and bank transfer are prepared for the live payment step. PKR pricing follows the stored exchange rate with a small buffer.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((option) => <div className="rounded-full border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.58)] px-4 py-3 text-sm" key={option}>{option}</div>)}
            </div>
          </section>

          <section className="panel-soft p-6">
            <h2 className="text-3xl">Milestones</h2>
            <div className="mt-5 space-y-4 text-sm leading-6 text-[#3a3a38]">
              <p>Growth and Premium use milestone payments: 50% at checkout and 50% when deliverables are marked received.</p>
              <p>Each paid order receives a delivery date. Overdue work is flagged for admin follow-up and seller notification.</p>
              <p>You can buy support before or after the audit. The audit remains a readiness diagnostic, and public listing still depends on review, documents, and admin approval.</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
