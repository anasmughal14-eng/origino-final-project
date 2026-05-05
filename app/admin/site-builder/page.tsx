"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type Section = { id: string; type: string };

const sectionTypes = ["Hero", "Stats", "Clusters", "Featured Suppliers", "CTA", "FAQ"];

export default function AdminSiteBuilderPage() {
  const [sections, setSections] = useState<Section[]>([{ id: "hero", type: "Hero" }]);
  const [selectedType, setSelectedType] = useState("Stats");
  const [publishing, setPublishing] = useState(false);

  function move(index: number, dir: -1 | 1) {
    const next = [...sections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  }

  function addSection() {
    setSections((list) => [...list, { id: `${selectedType.toLowerCase().replaceAll(" ", "-")}-${Date.now()}`, type: selectedType }]);
  }

  async function publish() {
    setPublishing(true);
    const response = await fetch("/api/admin/site-builder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections }) });
    const json = (await response.json()) as { success: boolean; data?: { count: number }; error?: string };
    setPublishing(false);
    if (!json.success) {
      toast.error(json.error ?? "Publish failed");
      return;
    }
    toast.success(`Published ${json.data?.count ?? sections.length} sections`);
  }

  return (
    <div>
      <h1 className="text-4xl">Site Builder</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <select className="input-editorial max-w-xs" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
          {sectionTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
        <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={addSection}>Add Section</button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          {sections.map((section, index) => (
            <div className="flex flex-wrap items-center justify-between gap-2 border p-4" key={section.id}>
              <span>{section.type}</span>
              <div className="flex flex-wrap gap-2">
                <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => move(index, -1)} disabled={index === 0}>Up</button>
                <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => move(index, 1)} disabled={index === sections.length - 1}>Down</button>
                <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => setSections((list) => list.filter((item) => item.id !== section.id))}>Remove</button>
              </div>
            </div>
          ))}
        </section>
        <aside className="border p-5">
          <h2 className="text-2xl">Preview</h2>
          {sections.map((section) => <div className="mt-3 border p-3" key={section.id}>{section.type} section</div>)}
          <button className="btn-pill btn-pill-forest mt-5 min-h-[44px]" onClick={publish} disabled={publishing || sections.length === 0}>{publishing ? "Publishing..." : "Publish Changes"}</button>
        </aside>
      </div>
    </div>
  );
}
