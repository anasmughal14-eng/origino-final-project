"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function BuyerApiKeysPage() {
  const [keys, setKeys] = useState([{ id: "key-1", name: "Enterprise sourcing feed", token: "origino_live_masked_9K2", active: true }]);

  function createKey() {
    setKeys((items) => [{ id: `key-${Date.now()}`, name: "New buyer API key", token: "origino_live_masked_" + Math.random().toString(36).slice(2, 5).toUpperCase(), active: true }, ...items]);
    toast.success("API key generated");
  }

  function revoke(id: string) {
    setKeys((items) => items.map((item) => item.id === id ? { ...item, active: false } : item));
    toast.success("API key revoked");
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="badge-patch">ENTERPRISE ACCESS</span>
          <h1 className="mt-4 text-4xl">API Keys</h1>
          <p className="mt-3 text-[#5a5a54]">Manage buyer API access for saved searches, supplier feeds, and sourcing integrations.</p>
        </div>
        <button className="btn-pill btn-pill-forest" onClick={createKey}>Generate Key</button>
      </div>
      <div className="mt-8 space-y-3">
        {keys.map((item) => (
          <div className="flex flex-wrap items-center justify-between gap-4 border border-[#e2ddd8] p-5" key={item.id}>
            <div>
              <h2 className="text-2xl">{item.name}</h2>
              <p className="metric-numeral mt-2">{item.token}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge-patch">{item.active ? "ACTIVE" : "REVOKED"}</span>
              <button className="btn-pill btn-pill-outline" disabled={!item.active} onClick={() => revoke(item.id)}>Revoke</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
