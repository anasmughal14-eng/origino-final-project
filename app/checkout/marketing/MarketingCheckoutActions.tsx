"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

type PaymentMethod = "stripe" | "bank_transfer" | "jazzcash" | "easypaisa";

type CheckoutResponse = {
  success: boolean;
  data?: {
    orderId: string;
    method: PaymentMethod;
    status: string;
    reference?: string;
    message: string;
    nextUrl?: string;
  };
  error?: string;
};

const paymentMethods: Array<{ value: PaymentMethod; label: string; note: string; action: string }> = [
  {
    value: "stripe",
    label: "International card",
    note: "Card checkout route for international payments.",
    action: "Secure by card",
  },
  {
    value: "bank_transfer",
    label: "Bank transfer",
    note: "Creates a payable ORIGINO reference.",
    action: "Create bank reference",
  },
  {
    value: "jazzcash",
    label: "JazzCash",
    note: "PKR wallet route for local payment.",
    action: "Secure with JazzCash",
  },
  {
    value: "easypaisa",
    label: "EasyPaisa",
    note: "PKR wallet route for local payment.",
    action: "Secure with EasyPaisa",
  },
];

export default function MarketingCheckoutActions({
  packageKey,
  amountUsd,
  packageName,
  sellerReady = false,
}: {
  packageKey: string;
  amountUsd: number;
  packageName: string;
  sellerReady?: boolean;
}) {
  const [method, setMethod] = useState<PaymentMethod>("bank_transfer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResponse["data"] | null>(null);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  const selectedMethod = paymentMethods.find((item) => item.value === method) ?? paymentMethods[1];
  const checkoutPath = `/checkout/marketing?package=${packageKey}`;
  const registerHref = `/register?role=seller&package=${packageKey}&redirect=${encodeURIComponent(checkoutPath)}`;
  const loginHref = `/login?redirect=${encodeURIComponent(checkoutPath)}`;

  async function confirmCheckout() {
    setLoading(true);
    setError("");
    setResult(null);
    setAuthRequired(false);
    try {
      const response = await fetch("/api/marketing-packages/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageKey, amountUsd, paymentMethod: method }),
      });
      const payload = (await response.json()) as CheckoutResponse;
      if (!response.ok || !payload.success || !payload.data) {
        if (response.status === 401) {
          setAuthRequired(true);
          setError("");
          return;
        }
        setError(payload.error ?? "Unable to start checkout.");
        return;
      }
      setResult(payload.data);
      toast.success(payload.data.message);
      if (payload.data.nextUrl) {
        window.setTimeout(() => {
          window.location.href = payload.data?.nextUrl ?? "/seller/onboarding";
        }, 1200);
      }
    } catch {
      setError("Unable to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[#8a8178]">Payment method</p>
      <div className="mt-4 space-y-3">
        {paymentMethods.map((item) => (
          <button
            aria-pressed={method === item.value}
            className={`min-h-[72px] w-full cursor-pointer rounded-[22px] border p-4 text-left transition hover:-translate-y-0.5 ${
              method === item.value ? "border-[#4f5b3a] bg-[#eef0e8] shadow-[0_16px_35px_rgba(45,74,62,0.12)]" : "border-[rgba(44,44,44,0.1)] bg-[rgba(255,250,242,0.58)]"
            }`}
            key={item.value}
            onClick={() => {
              setMethod(item.value);
              setError("");
              setAuthRequired(false);
              setResult(null);
            }}
            type="button"
          >
            <span className="flex items-start justify-between gap-4">
              <span>
                <span className="font-semibold">{item.label}</span>
                <span className="mt-1 block text-xs leading-5 text-[#6b6560]">{item.note}</span>
              </span>
              <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${method === item.value ? "border-[#4f5b3a] text-[#4f5b3a]" : "border-[rgba(44,44,44,0.18)] text-[#8a8178]"}`}>
                {method === item.value ? "Selected" : "Choose"}
              </span>
            </span>
          </button>
        ))}
      </div>

      {sellerReady && (
        <div className="mt-4 rounded-[22px] border border-[rgba(44,44,44,0.1)] bg-[rgba(255,250,242,0.72)] p-4 text-sm leading-6">
          <p className="font-semibold">Next step: {selectedMethod.action}</p>
          <p className="mt-1 text-[#6b6560]">
            {method === "bank_transfer"
              ? "ORIGINO creates the payment reference here and alerts admin for confirmation."
              : "ORIGINO reserves the package and creates an admin follow-up until this provider is live."}
          </p>
        </div>
      )}
      {error && <p className="mt-4 rounded-2xl border border-[var(--terracotta)] bg-[rgba(166,93,87,0.08)] p-3 text-sm text-[var(--terracotta)]">{error}</p>}
      {authRequired && (
        <p className="mt-4 rounded-2xl border border-[rgba(184,145,58,0.22)] bg-[rgba(245,237,219,0.58)] p-3 text-sm leading-6 text-[#5a5145]">
          A manufacturer profile is needed before payment can be attached. The selected package stays carried into the next step.
        </p>
      )}
      {result && (
        <div className="mt-4 rounded-[22px] border border-[rgba(79,91,58,0.18)] bg-[rgba(232,240,236,0.9)] p-4 text-sm leading-6">
          <p className="font-semibold">{packageName} order reserved</p>
          <p>{result.message}</p>
          {result.reference && <p className="metric-numeral mt-2">Reference: {result.reference}</p>}
          {result.nextUrl && <p className="mt-2 font-semibold">Redirecting to seller onboarding so ORIGINO can tailor the support and readiness map.</p>}
          {method === "bank_transfer" && (
            <div className="mt-3 border-t border-[rgba(45,74,62,0.16)] pt-3">
              <p className="font-semibold">Manual payment instruction</p>
              <p>Use the reference above with your bank transfer. Admin will confirm the payment and start SLA tracking.</p>
            </div>
          )}
        </div>
      )}

      {sellerReady ? (
        <button className="btn-pill btn-pill-forest mt-5 min-h-[44px] w-full justify-center" onClick={confirmCheckout} disabled={loading} type="button">
          {loading ? "Preparing checkout..." : selectedMethod.action}
        </button>
      ) : (
        <Link className="btn-pill btn-pill-forest mt-5 min-h-[44px] w-full justify-center" href={registerHref}>
          Secure selected package
        </Link>
      )}
      {!sellerReady && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center text-xs leading-5 text-[#6b6560]">
          <span>Profile details are collected next to attach payment and admin notification.</span>
          <Link className="font-semibold underline decoration-[#2d4a3e]" href={loginHref}>
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
