import Link from "next/link";

const packages = [
  {
    key: "basic",
    name: "Foundation",
    promise: "Enter the System",
    price: "$2,500",
    delivery: "within 21 days",
    summary: "Enter ORIGINO's structured pathway and align your business for marketplace progression within 21 days.",
    support: "This stage establishes the structure buyers need before visibility is considered.",
    deliverables: [
      "Brand identity and positioning system",
      "Buyer facing product presentation",
      "LinkedIn and Instagram setup",
      "ORIGINO marketplace entry",
      "Strategic audit and export roadmap",
      "Buyer clarity and readiness templates",
    ],
    proof: [
      { label: "Value", text: "Structured entry into ORIGINO." },
      { label: "Best for", text: "Manufacturers preparing for placement." },
      { label: "Effort", text: "You provide product information." },
    ],
    guarantee: "We continue until your entry profile reaches ORIGINO's credibility standard.",
    cta: "Start Foundation",
    accent: "foundation",
  },
  {
    key: "growth",
    name: "Transformation",
    promise: "Become Marketplace Ready",
    price: "$7,500",
    delivery: "30 to 45 days",
    summary: "Prepare your business for buyer evaluation, global comparison, and marketplace placement eligibility within 30 to 45 days.",
    support: "Readiness creates trust. Standardized presentation makes buyer evaluation faster.",
    deliverables: [
      "Everything in Foundation",
      "Export product photography system",
      "Conversion focused export website",
      "Content and visibility system",
      "Enhanced marketplace positioning",
      "Buyer discovery exposure",
    ],
    proof: [
      { label: "Value", text: "Readiness for curated placement." },
      { label: "Best for", text: "Manufacturers ready for buyer review." },
      { label: "Effort", text: "ORIGINO handles setup." },
    ],
    guarantee: "We continue until your business reaches ORIGINO's buyer ready standard.",
    featured: true,
    cta: "Start Transformation",
    accent: "transformation",
  },
  {
    key: "premium",
    name: "Access",
    promise: "Get Placed and Seen",
    price: "$18,000",
    delivery: "45 to 60 days",
    summary: "Activate marketplace placement, buyer visibility, introductions, and structured deal flow within 45 to 60 days.",
    support: "This is full marketplace activation for manufacturers that have earned placement.",
    deliverables: [
      "Everything in Transformation",
      "Full product catalog system",
      "Brand story film",
      "ORIGINO export certification",
      "Priority marketplace placement",
      "5+ vetted buyer introductions",
    ],
    proof: [
      { label: "Value", text: "Selective buyer marketplace placement." },
      { label: "Best for", text: "Manufacturers ready for deal flow." },
      { label: "Effort", text: "You focus on fulfillment." },
    ],
    guarantee: "We continue support until placement and visibility benchmarks are achieved.",
    cta: "Apply for Access",
    accent: "access",
  },
];

const tierStyles = {
  foundation: {
    card: "border-[rgba(128,106,78,0.18)] bg-[rgba(255,250,242,0.72)]",
    metric: "border-[rgba(128,106,78,0.18)] bg-[rgba(255,250,242,0.58)]",
    guarantee: "border-[rgba(128,106,78,0.18)] bg-[rgba(247,239,226,0.7)]",
    cta: "btn-pill-forest",
    rail: "bg-[rgba(128,106,78,0.42)]",
  },
  transformation: {
    card: "border-[rgba(84,98,64,0.38)] bg-[rgba(238,240,227,0.72)] shadow-[0_28px_80px_rgba(79,91,58,0.16)]",
    metric: "border-[rgba(84,98,64,0.2)] bg-[rgba(246,249,238,0.78)]",
    guarantee: "border-[rgba(84,98,64,0.22)] bg-[rgba(230,235,214,0.74)]",
    cta: "btn-pill-forest shadow-[0_14px_34px_rgba(79,91,58,0.24)]",
    rail: "bg-[#546240]",
  },
  access: {
    card: "border-[rgba(184,145,58,0.28)] bg-[rgba(255,248,235,0.72)]",
    metric: "border-[rgba(184,145,58,0.22)] bg-[rgba(255,248,235,0.8)]",
    guarantee: "border-[rgba(184,145,58,0.24)] bg-[rgba(247,235,210,0.72)]",
    cta: "btn-pill-forest",
    rail: "bg-[rgba(184,145,58,0.72)]",
  },
} as const;

const paymentOptions = [
  "Stripe for international cards",
  "JazzCash in PKR equivalent",
  "EasyPaisa in PKR equivalent",
  "Bank transfer with ORIGINO reference code",
];

export default function MarketingPackagesPage() {
  return (
    <div className="page-enter pt-24 md:pt-28">
      <section className="container-editorial pb-12 md:pb-16">
        <div className="grid max-w-[73rem] gap-5 md:gap-8 lg:grid-cols-[0.95fr_0.7fr] lg:items-end">
          <div className="text-center md:text-left">
            <p className="badge-patch tier-certified mx-auto mb-4 md:mx-0 md:mb-5">Curated Marketplace Entry</p>
            <div className="relative mt-2 max-w-[48rem]">
              <div className="absolute -inset-x-3 -inset-y-3 rounded-[26px] border border-[rgba(84,98,64,0.2)] bg-[linear-gradient(135deg,rgba(238,240,227,0.95),rgba(255,248,235,0.88))] shadow-[0_22px_70px_rgba(84,98,64,0.16)] md:-inset-x-5 md:-inset-y-4 md:rounded-[34px]" />
              <h1 className="relative mx-auto max-w-[24ch] text-center text-[2.22rem] leading-[0.98] text-[#152016] md:mx-0 md:max-w-none md:text-left md:text-[4rem] md:leading-[0.98]">
                <span className="block md:inline">Earn your place inside a</span>
                <span className="hidden md:inline"> </span>
                <span className="block md:inline">trusted buyer marketplace.</span>
              </h1>
            </div>
            <p className="mx-auto mt-5 max-w-[47rem] text-[0.98rem] leading-7 text-[#5a5a54] md:mx-0 md:mt-7 md:text-lg md:leading-8">
              ORIGINO prepares manufacturers for serious buyer review, then places qualified businesses where demand can find them.
            </p>
            <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap md:mt-8">
              <Link className="btn-pill btn-pill-forest min-h-[44px] w-full sm:w-auto" href="#packages">
                View entry stages
              </Link>
              <Link className="btn-pill btn-pill-outline min-h-[44px] w-full sm:w-auto" href="/audit">
                Run readiness audit
              </Link>
            </div>
          </div>

          <aside className="panel-soft border-[rgba(84,98,64,0.22)] bg-[rgba(238,240,227,0.64)] p-4 shadow-[0_24px_70px_rgba(79,91,58,0.12)] md:p-6">
            <p className="text-[0.7rem] uppercase tracking-[0.2em] text-[#6f764e]">Marketplace pathway</p>
            <div className="mt-4 space-y-3 md:mt-5 md:space-y-4">
              {[
                ["01", "Qualify", "Confirm fit and export intent"],
                ["02", "Prepare", "Build a buyer ready profile"],
                ["03", "Place", "Enter curated buyer visibility"],
              ].map(([number, title, text]) => (
                <div className="grid grid-cols-[2.55rem_1fr] gap-3 border-t border-[rgba(84,98,64,0.16)] pt-3 first:border-t-0 first:pt-0 md:grid-cols-[3rem_1fr] md:gap-4 md:pt-4" key={number}>
                  <span className="metric-numeral text-xl text-[#546240] md:text-2xl">{number}</span>
                  <span>
                    <span className="block text-base font-semibold text-[#1f1f1d] md:text-lg">{title}</span>
                    <span className="mt-1 block text-sm leading-5 text-[#5a5a54] md:leading-6">{text}</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-[16px] border border-[rgba(184,145,58,0.22)] bg-[rgba(255,248,235,0.68)] p-3 text-sm leading-6 text-[#3a3a38] md:mt-5 md:rounded-[18px] md:p-4">
              Buyers see manufacturers after standards are met.
            </p>
          </aside>
        </div>

        <div className="mt-7 grid max-w-[73rem] gap-3 md:mt-12 md:grid-cols-3 md:gap-4">
          {[
            ["Selected", "Entry is reviewed.", "border-[rgba(128,106,78,0.18)] bg-[rgba(255,250,242,0.7)]"],
            ["Prepared", "Profiles are standardized.", "border-[rgba(84,98,64,0.2)] bg-[rgba(238,240,227,0.7)]"],
            ["Placed", "Visibility is earned.", "border-[rgba(184,145,58,0.22)] bg-[rgba(255,248,235,0.76)]"],
          ].map(([label, text, classes]) => (
            <div className={`rounded-[18px] border px-4 py-3 md:rounded-[22px] md:px-5 md:py-4 ${classes}`} key={label}>
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a8178]">{label}</p>
              <p className="mt-2 text-sm leading-6 text-[#3a3a38]">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid max-w-[73rem] gap-4 rounded-[22px] border-y border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.34)] px-4 py-6 md:mt-16 md:grid-cols-[0.78fr_1fr] md:items-start md:rounded-none md:px-6 md:py-8">
          <h2 className="text-[1.75rem] leading-tight md:text-[3.15rem]">Manufacturing is strong. Visibility is limited.</h2>
          <div>
            <p className="text-[0.98rem] leading-7 text-[#5a5a54] md:text-lg md:leading-8">
              Most manufacturers do not lose because of production quality. They lose because global buyers cannot understand, compare, or trust them fast enough.
            </p>
            <p className="mt-4 rounded-[16px] border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.62)] p-3 text-sm leading-6 text-[#3a3a38] md:mt-5 md:rounded-[18px] md:p-4">
              ORIGINO closes that gap through selection, preparation, and controlled marketplace placement.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 lg:hidden">
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a8178]">Swipe right to compare packages</p>
          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="h-px w-10 bg-[rgba(84,98,64,0.28)]" />
            <span className="text-sm text-[#546240]">Foundation</span>
            <span className="text-sm text-[#8a8178]">Next</span>
          </div>
        </div>

        <div id="packages" className="mt-3 flex snap-x snap-mandatory scroll-mt-24 gap-3 overflow-x-auto pb-3 md:mt-14 md:scroll-mt-28 lg:grid lg:grid-cols-3 lg:items-start lg:gap-5 lg:overflow-visible lg:pb-0">
          {packages.map((tier) => {
            const styles = tierStyles[tier.accent as keyof typeof tierStyles];

            return (
            <article id={tier.key} className={`panel-soft relative flex h-full min-w-[82vw] snap-start flex-col overflow-hidden p-4 sm:min-w-[25rem] md:p-7 lg:min-w-0 ${styles.card}`} key={tier.name}>
              <div className={`absolute inset-x-0 top-0 h-1 ${styles.rail}`} />
              <div className="flex min-h-0 items-start justify-between gap-3 md:min-h-[13.5rem]">
                <div className="min-w-0">
                  <h2 className="text-[1.62rem] leading-none md:text-3xl">{tier.name}</h2>
                  <p className="mt-2 text-base leading-6 text-[#1f1f1d] md:text-lg">{tier.promise}</p>
                  <p className="mt-3 text-sm leading-6 text-[#5a5a54]">{tier.summary}</p>
                </div>
                {tier.featured && <span className="badge-patch shrink-0 bg-[rgba(84,98,64,0.1)] text-[0.62rem] text-[#3f4b31] sm:text-[0.7rem]">Most Popular</span>}
              </div>
              <div className={`mt-4 grid overflow-hidden rounded-[18px] border sm:grid-cols-[minmax(0,1.1fr)_minmax(6.75rem,0.9fr)] md:mt-6 md:rounded-[22px] ${styles.metric}`}>
                <div className="min-w-0 p-3 md:p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a8178]">Price</p>
                  <p className="metric-numeral mt-1 text-[1.75rem] leading-none md:text-[2.15rem]">{tier.price}</p>
                </div>
                <div className="min-w-0 border-t border-[#e2ddd8] p-3 sm:border-l sm:border-t-0 md:p-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a8178]">Time</p>
                  <p className="mt-2 text-sm leading-5 text-[#3a3a38]">{tier.delivery}</p>
                </div>
              </div>
              <div className="mt-5 min-h-0 text-sm leading-6 text-[#3a3a38] md:min-h-[6rem]">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a8178]">System role</p>
                <p className="mt-2">{tier.support}</p>
              </div>
              <div className="mt-5 flex-1">
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a8178]">What you get</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#3a3a38]">
                  {tier.deliverables.map((feature) => (
                    <li className="border-t border-[#e2ddd8] pt-2" key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-5 space-y-3 rounded-[18px] border border-[#e2ddd8] bg-[rgba(255,250,242,0.34)] p-4">
                {tier.proof.map((item) => (
                  <div className="grid grid-cols-[4.25rem_1fr] gap-3 border-t border-[rgba(44,44,44,0.07)] pt-3 text-sm leading-5 text-[#3a3a38] first:border-t-0 first:pt-0 sm:grid-cols-[4.75rem_1fr]" key={item.label}>
                    <span className="font-semibold text-[#1f1f1d]">{item.label}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className={`mt-5 rounded-[18px] border p-4 text-sm leading-6 text-[#3a3a38] ${styles.guarantee}`}>
                <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a8178]">Guarantee</p>
                <p className="mt-2">{tier.guarantee}</p>
              </div>
              <Link
                className={`btn-pill mt-6 min-h-[46px] w-full justify-center ${styles.cta}`}
                href={`/checkout/marketing?package=${tier.key}`}
              >
                {tier.cta}
              </Link>
            </article>
            );
          })}
        </div>

        <div className="mt-10 grid overflow-hidden rounded-[24px] border border-[rgba(84,98,64,0.16)] bg-[linear-gradient(135deg,rgba(255,250,242,0.72),rgba(238,240,227,0.58),rgba(255,248,235,0.72))] shadow-[0_24px_80px_rgba(44,44,44,0.08)] md:mt-12 md:rounded-[28px] lg:grid-cols-[0.95fr_1.05fr]">
          <section className="border-b border-[rgba(84,98,64,0.14)] p-5 md:p-8 lg:border-b-0 lg:border-r">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a8178]">Entry payment</p>
            <h2 className="mt-3 text-3xl leading-tight">Payment options</h2>
            <p className="mt-4 max-w-[34rem] text-sm leading-6 text-[#4f5148]">
              Payment starts a structured entry process. Visibility is still earned through review, readiness, and approval.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-6">
              {paymentOptions.map((option, index) => (
                <div className="rounded-[18px] border border-[rgba(84,98,64,0.14)] bg-[rgba(255,250,242,0.74)] p-4 text-sm leading-5 text-[#30302d] shadow-[0_12px_30px_rgba(44,44,44,0.04)]" key={option}>
                  <span className="mb-3 block h-1 w-10 rounded-full bg-[#546240]" />
                  <span className="text-[0.66rem] uppercase tracking-[0.16em] text-[#8a8178]">Option {index + 1}</span>
                  <span className="mt-1 block">{option}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="p-5 md:p-8">
            <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8a8178]">Progress control</p>
            <h2 className="mt-3 text-3xl leading-tight">Milestones</h2>
            <div className="mt-6 space-y-3">
              {[
                ["01", "Structured payments", "Transformation and Access can use milestone payments so progress stays tied to delivery."],
                ["02", "Tracked readiness", "Each participant receives a timeline for readiness, presentation, and placement requirements."],
                ["03", "Aligned growth", "A lower upfront and shared success model may be considered where incentives align."],
              ].map(([number, title, text], index) => (
                <div
                  className={`grid grid-cols-[2.55rem_1fr] gap-3 rounded-[18px] border p-4 text-sm leading-6 sm:grid-cols-[3rem_1fr] sm:gap-4 ${
                    index === 1
                      ? "border-[rgba(84,98,64,0.22)] bg-[rgba(238,240,227,0.72)]"
                      : index === 2
                        ? "border-[rgba(184,145,58,0.22)] bg-[rgba(255,248,235,0.72)]"
                        : "border-[rgba(128,106,78,0.16)] bg-[rgba(255,250,242,0.74)]"
                  }`}
                  key={number}
                >
                  <span className="metric-numeral text-xl leading-none text-[#546240] sm:text-2xl">{number}</span>
                  <span>
                    <span className="block font-semibold text-[#1f1f1d]">{title}</span>
                    <span className="mt-1 block text-[#4f5148]">{text}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
