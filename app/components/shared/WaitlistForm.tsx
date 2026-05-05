"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/join-waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role: "buyer" }),
    });
    const json = (await response.json()) as { success: boolean; error?: string };
    setLoading(false);
    if (!json.success) {
      setError(json.error ?? "Could not join waitlist.");
      return;
    }
    setEmail("");
    toast.success("You are on the ORIGINO waitlist.");
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <input className="input-editorial min-h-[44px]" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="work@email.com" />
        {error && <p className="mt-2 text-sm text-[#c0623a]">{error}</p>}
      </div>
      <button className="btn-pill btn-pill-forest min-h-[44px]" disabled={loading}>{loading ? "Joining..." : "Join Waitlist"}</button>
    </form>
  );
}
