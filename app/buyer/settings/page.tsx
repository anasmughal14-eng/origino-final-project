"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function BuyerSettingsPage() {
  const [form, setForm] = useState({ language: "en", quoteEmails: true, inspectionEmails: true, savedSearchEmails: true, twoFactor: false });
  const [loading, setLoading] = useState(false);

  function save() {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast.success("Buyer settings saved");
    }, 400);
  }

  return (
    <div>
      <span className="badge-patch">ACCOUNT CONTROLS</span>
      <h1 className="mt-4 text-4xl">Settings</h1>
      <p className="mt-3 max-w-3xl text-[#5a5a54]">Manage buyer language, notifications, security, and account preferences.</p>
      <div className="mt-8 border border-[#e2ddd8] p-5">
        <label><span className="label-editorial">Language</span><select className="input-editorial" value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })}><option value="en">English</option><option value="ur">Urdu</option></select></label>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {[
            ["quoteEmails", "Quote emails"],
            ["inspectionEmails", "Inspection emails"],
            ["savedSearchEmails", "Saved-search alerts"],
            ["twoFactor", "Two-factor authentication"],
          ].map(([key, label]) => (
            <label className="flex min-h-[44px] items-center gap-3 border border-[#e2ddd8] p-3" key={key}>
              <input checked={Boolean(form[key as keyof typeof form])} onChange={(event) => setForm({ ...form, [key]: event.target.checked })} type="checkbox" />
              {label}
            </label>
          ))}
        </div>
        <button className="btn-pill btn-pill-forest mt-5" disabled={loading} onClick={save}>{loading ? "Saving..." : "Save Settings"}</button>
      </div>
    </div>
  );
}
