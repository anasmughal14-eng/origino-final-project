import Link from "next/link";
import MarketingCheckoutActions from "./MarketingCheckoutActions";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { createSupabaseServiceClient } from "@/lib/supabase";

const packageDetails = {
  basic: {
    name: "Basic",
    priceUsd: 299,
    depositUsd: 299,
    delivery: "3 weeks",
    features: ["Brand audit call", "Logo concepts", "Stationery", "Social profile setup", "1-page product PDF"],
  },
  growth: {
    name: "Growth",
    priceUsd: 799,
    depositUsd: 400,
    delivery: "6 weeks",
    features: ["Everything in Basic", "Product photography", "5-page website", "Export documentation guide", "Buyer-network campaign"],
  },
  premium: {
    name: "Premium",
    priceUsd: 1999,
    depositUsd: 1000,
    delivery: "10 weeks",
    features: ["Everything in Growth", "Brand video", "Full product catalog website", "ORIGINO certification", "5 buyer introductions"],
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

  return (
    <div className="page-enter pt-28">
      <section className="container-editorial pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr]">
          <div className="panel-soft p-6 md:p-10">
            <p className="badge-patch tier-certified mb-5">Final checkout</p>
            <h1 className="text-5xl md:text-7xl">{tier.name} seller package</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5a5a54]">
              Confirm the marketing service order for your manufacturing company. This starts paid export-readiness work; marketplace approval still depends on the audit and admin review.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="dashboard-card p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a8178]">Total</p>
                <p className="metric-numeral mt-2 text-3xl">${tier.priceUsd.toLocaleString()}</p>
              </div>
              <div className="dashboard-card p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8a8178]">Due now</p>
                <p className="metric-numeral mt-2 text-3xl">${tier.depositUsd.toLocaleString()}</p>
              </div>
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
              <p className="font-semibold">Audit and listing rule</p>
              <p className="mt-1">This checkout does not auto-list the supplier. ORIGINO still checks audit score, sanctions, documents, and admin approval before marketplace visibility.</p>
            </div>
          </div>

          <aside className="panel-soft h-fit p-6 md:p-8">
            <h2 className="text-3xl">Payment summary</h2>
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between border-b border-[rgba(44,44,44,0.08)] pb-3">
                <span>{tier.name} package</span>
                <span className="metric-numeral">${tier.priceUsd.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[rgba(44,44,44,0.08)] pb-3">
                <span>Deposit due now</span>
                <span className="metric-numeral">${tier.depositUsd.toLocaleString()}</span>
              </div>
              {secondMilestone > 0 && (
                <div className="flex items-center justify-between border-b border-[rgba(44,44,44,0.08)] pb-3">
                  <span>Second milestone</span>
                  <span className="metric-numeral">${secondMilestone.toLocaleString()}</span>
                </div>
              )}
            </div>

            <MarketingCheckoutActions packageKey={packageKey} amountUsd={tier.depositUsd} packageName={tier.name} sellerReady={sellerReady} />

            <Link className="mt-5 inline-flex text-sm underline decoration-[#2d4a3e]" href="/seller/onboarding">
              Skip payment and start audit first
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}
