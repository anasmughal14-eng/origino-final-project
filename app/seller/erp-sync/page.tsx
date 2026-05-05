"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const stockRows = [
  { sku: "SURG-SCISSOR-18CM", product: "German Pattern Surgical Scissors", stock: 480, synced: "2026-05-04 09:20" },
  { sku: "DENT-FORCEPS-SET", product: "Dental Extraction Forceps Set", stock: 120, synced: "2026-05-04 09:20" },
  { sku: "OEM-KIT-12", product: "Reusable Surgical Kit", stock: 75, synced: "2026-05-03 18:45" },
];

const providers = ["SAP", "Oracle NetSuite", "Microsoft Dynamics", "Local Pakistani ERP", "Custom webhook"];

export default function SellerErpSyncPage() {
  const [provider, setProvider] = useState(providers[4]);
  const [webhookUrl, setWebhookUrl] = useState("https://erp.example.com/origino/stock");
  const [apiKey, setApiKey] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [lastTest, setLastTest] = useState("Not tested in this session");

  function testWebhook() {
    if (!webhookUrl.startsWith("https://")) {
      toast.error("Webhook URL must start with https://");
      return;
    }
    setLastTest(new Date().toLocaleString());
    toast.success("Webhook test passed.");
  }

  function saveSettings() {
    if (!apiKey.trim()) {
      toast.error("Add an API key label or token before saving.");
      return;
    }
    toast.success("ERP sync settings saved.");
  }

  return (
    <div className="space-y-8">
      <section>
        <span className="section-kicker">Live stock integration</span>
        <h1>ERP Sync</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Configure webhook-based stock updates so buyers see reliable availability and low-stock signals.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border p-5">
          <h2 className="text-2xl">Connection Settings</h2>
          <label className="mt-5 block text-xs uppercase tracking-[0.24em] text-ink-muted">ERP provider</label>
          <select className="input-editorial mt-2" value={provider} onChange={(event) => setProvider(event.target.value)}>
            {providers.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-ink-muted">Webhook URL</label>
          <input className="input-editorial mt-2" value={webhookUrl} onChange={(event) => setWebhookUrl(event.target.value)} />
          <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-ink-muted">API key label</label>
          <input
            className="input-editorial mt-2"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Production stock token"
          />
          <label className="mt-5 flex min-h-11 items-center gap-3">
            <input checked={enabled} type="checkbox" onChange={(event) => setEnabled(event.target.checked)} />
            <span>Enable live stock sync</span>
          </label>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn-pill btn-pill-outline" type="button" onClick={testWebhook}>
              Test Webhook
            </button>
            <button className="btn-pill btn-pill-forest" type="button" onClick={saveSettings}>
              Save Settings
            </button>
          </div>
          <p className="mt-4 text-sm text-ink-muted">Last test: {lastTest}</p>
        </div>

        <div className="border p-5">
          <h2 className="text-2xl">Supported Integrations</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {providers.slice(0, 4).map((item) => (
              <div className="border bg-cream p-4" key={item}>
                <strong>{item}</strong>
                <p className="mt-2 text-sm text-ink-soft">Webhook mapping ready for inventory and availability events.</p>
              </div>
            ))}
          </div>
          <div className="mt-5 border p-4">
            <p className="metric-text">{enabled ? "SYNC ENABLED" : "SYNC PAUSED"}</p>
            <p className="mt-2 text-ink-soft">{provider} will update product stock via the configured webhook.</p>
          </div>
        </div>
      </section>

      <section className="border">
        <div className="border-b bg-cream p-4">
          <h2 className="text-2xl">Live Stock Preview</h2>
        </div>
        <div className="divide-y">
          {stockRows.map((row) => (
            <div className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto_auto]" key={row.sku}>
              <strong>{row.product}</strong>
              <span>{row.sku}</span>
              <span className="metric-text">{row.stock} units</span>
              <span>{row.synced}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
