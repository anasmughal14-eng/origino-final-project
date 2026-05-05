"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthResponse = {
  success: boolean;
  data?: {
    role: "buyer" | "seller" | "admin" | "agent";
    redirect: string;
  };
  error?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setLoading(true);
    const redirect = new URLSearchParams(window.location.search).get("redirect") ?? "";
    const safeRedirect = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "";
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, redirect: safeRedirect }),
      });
      const result = (await response.json()) as AuthResponse;
      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? "Unable to sign in.");
        return;
      }
      const roleRedirect =
        result.data.role === "seller"
          ? "/seller/dashboard"
          : result.data.role === "admin"
            ? "/admin/dashboard"
            : result.data.role === "agent"
              ? "/agent/dashboard"
              : "/buyer/dashboard";
      const target = result.data.redirect || roleRedirect;
      router.push(target);
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="container-editorial pb-16 pt-28">
      <div className="panel-soft mx-auto grid max-w-6xl overflow-hidden p-0 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative min-h-[440px] overflow-hidden rounded-[24px] lg:rounded-r-none">
          <img
            className="h-full w-full object-cover"
            src="https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=1400"
            alt="Export operations desk"
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.28)]" />
          <div className="absolute bottom-8 left-8 right-8 text-[var(--cream)]">
            <p className="section-kicker border-[rgba(247,244,239,0.7)] text-[var(--cream)]">ORIGINO Access</p>
            <h1 className="mt-5 text-5xl leading-none text-[var(--cream)] md:text-7xl">Sign in to your trade desk.</h1>
          </div>
        </div>
        <div className="flex items-center p-6 md:p-10">
          <div className="w-full">
            <p className="text-sm leading-7 text-[var(--ink-muted)]">Open the right portal for supplier verification, buyer sourcing, admin operations, or agent workflow.</p>
            <form onSubmit={submit} className="mt-8 space-y-4">
              <input className="input-editorial min-h-[44px]" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
              <input className="input-editorial min-h-[44px]" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
              {error && <p className="rounded-2xl border border-[var(--terracotta)] bg-[rgba(166,93,87,0.08)] p-3 text-sm text-[var(--terracotta)]">{error}</p>}
              <button className="btn-pill btn-pill-forest min-h-[44px] w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
