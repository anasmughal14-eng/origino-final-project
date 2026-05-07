import Link from "next/link";
import MarketingCheckoutActions from "./MarketingCheckoutActions";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseServiceClient } from "@/lib/supabase";

const packageDetails = {
  basic: {
    name: "Foundation",
    priceUsd: 2500,
    depositUsd: 2500,
    delivery: "within 21 days",
    features: ["Brand identity and positioning system", "Buyer facing product presentation", "LinkedIn and Instagram setup", "ORIGINO marketplace entry", "Strategic audit and export roadmap"],
  },
  growth: {
    name: "Transformation",
    priceUsd: 7500,
    depositUsd: 7500,
    delivery: "30 to 45 days",
    features: ["Everything in Foundation", "Export product photography system", "Conversion focused export website", "Content and visibility system", "Enhanced marketplace positioning"],
  },
  premium: {
    name: "Access",
    priceUsd: 18000,
    depositUsd: 18000,
    delivery: "45 to 60 days",
    features: ["Everything in Transformation", "Full product catalog system", "Brand story film", "ORIGINO export certification", "Priority marketplace placement", "5 vetted buyer introductions"],
  },
} as const;

type PackageKey = keyof typeof packageDetails;

function selectedPackage(value: string | string[] | undefined): PackageKey {
  const key = Array.isArray(value) ? value[0] : value;
  return key === "basic" || key === "premium" ? key : "growth";
}

async function hasSellerSession() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return false;
    const { data: profile } = await createSupabaseServiceClient()
      .from("profiles")
      .select("role")
      .eq("id", auth.user.id)
      .maybeSingle();
    return profile?.role === "seller";
  } catch {
    return false;
  }
}

export default async function MarketingCheckoutPage({ searchParams }: { searchParams?: { package?: string | string[] } }) {
  const packageKey = selectedPackage(searchParams?.package);
  const tier = packageDetails[packageKey];
  const secondMilestone = tier.priceUsd - tier.depositUsd;
  const sellerReady = await hasSellerSession();
  const metricGridClass = secondMilestone > 0 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="page-enter pt-28">
      <section className="container-editorial pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr]">
          <div className="panel-soft p-6 md:p-10">
            <p className="badge-patch tier-certified mb-5">Package checkout</p>
            <h1 className="text-5xl md:text-7xl">{tier.name} marketplace entry</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5a5a54]">
              Review the selected entry stage, choose a payment route, and secure the package reference. ORIGINO attaches it to the manufacturer profile in the next step.
            </p>

            <div className={`mt-8 grid gap-4 ${metricGridClass}`}>
              <div className="dashboard-card p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a8178]">Total</p>
                <p className="metric-numeral mt-2 text-3xl">${tier.priceUsd.toLocaleString()}</p>
              </div>
              {secondMilestone > 0 && (
                <div className="dashboard-card p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8a8178]">Due now</p>
                  <p className="metric-numeral mt-2 text-3xl">${tier.depositUsd.toLocaleString()}</p>
                </div>
              )}
              <div className="dashboard-card p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a8178]">Delivery</p>
                <p className="mt-2 text-xl font-semibold">{tier.delivery}</p>
              </div>
            </div>

            <div className="mt-8 dashboard-card p-6">
              <h2 className="text-3xl">What is included</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {tier.features.map((feature) => (
                  <div className="rounded-full border border-[rgba(79,91,58,0.14)] bg-[rgba(255,250,242,0.72)] px-4 py-3 text-sm" key={feature}>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-[rgba(184,145,58,0.28)] bg-[rgba(245,237,219,0.78)] p-5 text-sm leading-6 text-[#3a3a38]">
              <p className="font-semibold">Placement remains selective</p>
              <p className="mt-1">Checkout starts the paid entry process. Public marketplace visibility still depends on readiness, documents, sanctions checks, and ORIGINO review.</p>
            </div>
          </div>

          <aside className="panel-soft h-fit p-6 md:p-8">
            <h2 className="text-3xl">Payment summary</h2>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-[rgba(44,44,44,0.08)] pb-3">
                <span>Selected stage</span>
                <span className="font-semibold">{tier.name}</span>
              </div>
              {secondMilestone > 0 ? (
                <>
                  <div className="flex items-center justify-between border-b border-[rgba(44,44,44,0.08)] pb-3">
                    <span>Deposit due now</span>
                    <span className="metric-numeral">${tier.depositUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[rgba(44,44,44,0.08)] pb-3">
                    <span>Second milestone</span>
                    <span className="metric-numeral">${secondMilestone.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between border-b border-[rgba(44,44,44,0.08)] pb-3">
                  <span>Checkout amount</span>
                  <span className="metric-numeral">${tier.depositUsd.toLocaleString()}</span>
                </div>
              )}
            </div>

            <MarketingCheckoutActions packageKey={packageKey} amountUsd={tier.depositUsd} packageName={tier.name} sellerReady={sellerReady} />

            <Link className="mt-5 inline-flex text-sm underline decoration-[#2d4a3e]" href="/marketing-packages">
              Compare packages again
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
