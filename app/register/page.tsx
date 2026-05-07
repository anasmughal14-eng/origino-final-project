"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type RegisterResponse = {
  success: boolean;
  data?: {
    role: "buyer" | "seller";
    redirect: string;
  };
  error?: string;
};

type RegisterSearchParams = {
  role?: string | string[];
  redirect?: string | string[];
  package?: string | string[];
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? "";
}

function cleanPackageInterest(value: string) {
  return value.replace(/[^a-z0-9_-]/gi, "").toLowerCase();
}

function packageFromRedirect(redirect: string) {
  if (!redirect.includes("?")) return "";
  return new URLSearchParams(redirect.split("?")[1]).get("package") ?? "";
}

export default function RegisterPage({ searchParams }: { searchParams?: RegisterSearchParams }) {
  const router = useRouter();
  const initialRole = firstParam(searchParams?.role) === "seller" ? "seller" : "buyer";
  const initialRedirect = firstParam(searchParams?.redirect);
  const initialPackageInterest = cleanPackageInterest(firstParam(searchParams?.package) || packageFromRedirect(initialRedirect));
  const [role, setRole] = useState<"buyer" | "seller">(initialRole);
  const [redirect, setRedirect] = useState(initialRole === "seller" ? "/seller/onboarding" : initialRedirect);
  const [packageInterest, setPackageInterest] = useState(initialPackageInterest);
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", city: "", category: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const sellerPackageFlow = role === "seller" && Boolean(packageInterest);
  const effectiveRedirect = sellerPackageFlow ? `/checkout/marketing?package=${packageInterest}` : role === "seller" ? "/seller/onboarding" : redirect;
  const loginHref = useMemo(() => effectiveRedirect ? `/login?redirect=${encodeURIComponent(effectiveRedirect)}` : "/login", [effectiveRedirect]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedRole = params.get("role");
    const requestedRedirect = params.get("redirect") ?? "";
    const directPackage = params.get("package") ?? "";
    if (requestedRole === "seller" || requestedRole === "buyer") setRole(requestedRole);
    if (requestedRedirect.startsWith("/") && !requestedRedirect.startsWith("//")) {
      setRedirect(requestedRole === "seller" ? "/seller/onboarding" : requestedRedirect);
    }
    const redirectPackage = packageFromRedirect(requestedRedirect);
    const selectedPackage = directPackage || redirectPackage;
    if (selectedPackage) setPackageInterest(cleanPackageInterest(selectedPackage));
  }, []);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.name || !form.company || !form.email.includes("@")) return setError("Name, company, and valid email are required.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (role === "seller" && (!form.city || !form.category)) return setError("City and category are required for sellers.");
    setLoading(true);
    try {
      if (role === "seller" && packageInterest) {
        window.localStorage.setItem("origino_pending_package", packageInterest);
      }
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role, redirect: effectiveRedirect, packageInterest }),
      });
      const result = (await response.json()) as RegisterResponse;
      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? "Unable to create account.");
        return;
      }
      router.push(result.data.redirect);
      router.refresh();
    } catch {
      setError("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-editorial pb-16 pt-28">
      <div className="panel-soft mx-auto grid max-w-6xl overflow-hidden p-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[560px] overflow-hidden rounded-[24px] lg:rounded-r-none">
          <img
            className="h-full w-full object-cover"
            src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400"
            alt="Exporter registration review"
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)]" />
          <div className="absolute bottom-8 left-8 right-8 text-[var(--cream)]">
            <p className="section-kicker border-[rgba(247,244,239,0.7)] text-[var(--cream)]">Join ORIGINO</p>
            <h1 className="mt-5 text-5xl leading-none text-[var(--cream)] md:text-7xl">{sellerPackageFlow ? "Attach your selected package." : role === "seller" ? "Start your export readiness audit." : "Create your sourcing account."}</h1>
          </div>
        </div>
        <div className="p-6 md:p-10">
          {sellerPackageFlow ? (
            <div className="rounded-[28px] border border-[rgba(79,91,58,0.16)] bg-[rgba(247,244,239,0.78)] p-5 text-sm leading-6 text-[#3a3a38]">
              <p className="badge-patch mb-3">Seller service</p>
              <h2 className="text-3xl capitalize">{packageInterest} package selected</h2>
              <p className="mt-3">Your package choice is already set. Create a seller account so ORIGINO can attach checkout, readiness work, and supplier records to the right business.</p>
              <div className="mt-4 rounded-[22px] border border-[rgba(184,145,58,0.28)] bg-[rgba(245,237,219,0.78)] p-4">
                <p className="font-semibold">Audit rule stays active</p>
                <p className="mt-1 text-xs leading-5 text-[#5a5a54]">Buying a package starts paid export-readiness support. Public marketplace listing still requires the ORIGINO audit, admin review, and document checks.</p>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {["Package selected", "Create account", "Confirm checkout"].map((step, index) => (
                  <div className="rounded-full border border-[rgba(79,91,58,0.14)] bg-[rgba(255,250,242,0.72)] px-3 py-2 text-xs font-semibold" key={step}>{index + 1}. {step}</div>
                ))}
              </div>
            </div>
          ) : role === "seller" && (
            <div className="rounded-[28px] border border-[rgba(79,91,58,0.16)] bg-[rgba(247,244,239,0.78)] p-5 text-sm leading-6 text-[#3a3a38]">
              <p className="badge-patch mb-3">Seller path</p>
              <p>Pakistani manufacturers are often strongest at the work itself. ORIGINO helps with the layer around it: presentation, documents, buyer context, and export readiness. The audit shows where you stand; services can begin whenever you are ready.</p>
              {packageInterest && (
                <div className="mt-4 rounded-[22px] border border-[rgba(184,145,58,0.28)] bg-[rgba(245,237,219,0.78)] p-4">
                  <p className="font-semibold capitalize">{packageInterest} package interest noted</p>
                  <p className="mt-1 text-xs leading-5 text-[#5a5a54]">This does not create a paid order yet. After account creation, you can confirm checkout and still complete the readiness audit before public listing.</p>
                </div>
              )}
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {["Create account", "Choose support", "Run audit"].map((step, index) => (
                  <div className="rounded-full border border-[rgba(79,91,58,0.14)] bg-[rgba(255,250,242,0.72)] px-3 py-2 text-xs font-semibold" key={step}>{index + 1}. {step}</div>
                ))}
              </div>
              <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                {["Brand identity", "Digital presence", "Export history", "Product readiness", "Operational capacity", "Compliance documents"].map((item) => (
                  <div className="rounded-full border border-[rgba(79,91,58,0.12)] bg-[rgba(255,250,242,0.58)] px-3 py-2" key={item}>{item}</div>
                ))}
              </div>
            </div>
          )}
          {!sellerPackageFlow && (
            <div className="mt-6 flex gap-2">{(["buyer", "seller"] as const).map((item) => <button type="button" className={item === role ? "btn-pill btn-pill-forest min-h-[44px]" : "btn-pill btn-pill-outline min-h-[44px]"} key={item} onClick={() => setRole(item)}>{item === "buyer" ? "Buyer" : "Seller"}</button>)}</div>
          )}
          <form onSubmit={submit} className="mt-8 space-y-4">
            <input className="input-editorial min-h-[44px]" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Full name" />
            <input className="input-editorial min-h-[44px]" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="Email" />
            <input className="input-editorial min-h-[44px]" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="Password" />
            <input className="input-editorial min-h-[44px]" value={form.company} onChange={(event) => update("company", event.target.value)} placeholder="Company name" />
            {role === "seller" && <><input className="input-editorial min-h-[44px]" value={form.city} onChange={(event) => update("city", event.target.value)} placeholder="City" /><input className="input-editorial min-h-[44px]" value={form.category} onChange={(event) => update("category", event.target.value)} placeholder="Product category" /></>}
            {error && <p className="rounded-2xl border border-[var(--terracotta)] bg-[rgba(166,93,87,0.08)] p-3 text-sm text-[var(--terracotta)]">{error}</p>}
            <button className="btn-pill btn-pill-forest min-h-[44px] w-full" disabled={loading}>
              {loading ? "Creating account..." : sellerPackageFlow ? "Create Account & Return to Checkout" : role === "seller" ? "Create Seller Account" : "Create Buyer Account"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-[#5a5a54]">
            Already registered? <Link className="underline decoration-[#2d4a3e]" href={loginHref}>Sign in to continue</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
