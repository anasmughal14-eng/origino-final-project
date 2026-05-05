"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function SellerSettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [agreement, setAgreement] = useState(true);
  const [notifications, setNotifications] = useState({ inquiries: true, quotes: true, documents: true, health: true });
  const [deleteReason, setDeleteReason] = useState("");
  const [saving, setSaving] = useState("");

  function save(section: string) {
    setSaving(section);
    window.setTimeout(() => {
      setSaving("");
      toast.success(`${section} settings saved`);
    }, 500);
  }

  function requestDeletion() {
    if (!deleteReason.trim()) {
      toast.error("Add a reason before submitting a data deletion request");
      return;
    }
    save("Data deletion request");
    setDeleteReason("");
  }

  return (
    <div>
      <span className="badge-patch">Seller Settings</span>
      <h1 className="mt-4 text-4xl">Settings</h1>
      <p className="mt-3 max-w-3xl text-[var(--ink-soft)]">Security, language, agreement, notifications, and data deletion controls. These are local-state stubs now and map directly to profiles, seller agreement versions, and notification preferences in Supabase.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="border border-[var(--border)] p-5">
          <h2 className="text-2xl">Security</h2>
          <label className="mt-4 flex min-h-[44px] items-center justify-between gap-4 border border-[var(--border)] p-3">
            <span>Two-factor authentication</span>
            <input type="checkbox" checked={twoFactor} onChange={(event) => setTwoFactor(event.target.checked)} />
          </label>
          <button className="btn-pill btn-pill-forest mt-4 min-h-[44px]" onClick={() => save("Security")} disabled={saving === "Security"}>{saving === "Security" ? "Saving..." : "Save Security"}</button>
        </section>

        <section className="border border-[var(--border)] p-5">
          <h2 className="text-2xl">Language</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setLanguage("en")}>{language === "en" ? "EN selected" : "EN"}</button>
            <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setLanguage("ur")}>{language === "ur" ? "Urdu selected" : "Urdu"}</button>
          </div>
          <button className="btn-pill btn-pill-forest mt-4 min-h-[44px]" onClick={() => save("Language")} disabled={saving === "Language"}>{saving === "Language" ? "Saving..." : "Save Language"}</button>
        </section>

        <section className="border border-[var(--border)] p-5">
          <h2 className="text-2xl">Seller Agreement</h2>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">Version 1.0 accepted on May 3, 2026. New versions will require re-acceptance before portal access.</p>
          <label className="mt-4 flex min-h-[44px] items-center gap-2">
            <input type="checkbox" checked={agreement} onChange={(event) => setAgreement(event.target.checked)} />
            I accept the current seller agreement and commission reporting clause.
          </label>
          <button className="btn-pill btn-pill-forest mt-4 min-h-[44px]" onClick={() => save("Agreement")} disabled={!agreement || saving === "Agreement"}>{saving === "Agreement" ? "Saving..." : "Save Agreement"}</button>
        </section>

        <section className="border border-[var(--border)] p-5">
          <h2 className="text-2xl">Notifications</h2>
          <div className="mt-4 grid gap-2">
            {Object.entries(notifications).map(([key, value]) => (
              <label className="flex min-h-[44px] items-center justify-between border border-[var(--border)] p-3" key={key}>
                <span className="capitalize">{key.replace("_", " ")}</span>
                <input type="checkbox" checked={value} onChange={(event) => setNotifications((current) => ({ ...current, [key]: event.target.checked }))} />
              </label>
            ))}
          </div>
          <button className="btn-pill btn-pill-forest mt-4 min-h-[44px]" onClick={() => save("Notification")} disabled={saving === "Notification"}>{saving === "Notification" ? "Saving..." : "Save Notifications"}</button>
        </section>
      </div>

      <section className="mt-6 border border-[var(--terracotta)] p-5">
        <h2 className="text-2xl">Data Deletion Request</h2>
        <p className="mt-2 text-sm text-[var(--ink-muted)]">Creates a 30-day admin task in production. This mock version validates and records the request locally.</p>
        <textarea className="input-editorial mt-4 min-h-[120px]" value={deleteReason} onChange={(event) => setDeleteReason(event.target.value)} placeholder="Reason for deletion request" />
        <button className="btn-pill btn-pill-outline mt-4 min-h-[44px] border-[var(--terracotta)] text-[var(--terracotta)]" onClick={requestDeletion} disabled={saving === "Data deletion request"}>{saving === "Data deletion request" ? "Submitting..." : "Submit Deletion Request"}</button>
      </section>
    </div>
  );
}
