"use client";

/* eslint-disable @next/next/no-img-element */
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type MediaType = "none" | "image" | "video";
type PreviewMode = "desktop" | "mobile";

type ThemeDraft = {
  background: string;
  panel: string;
  primary: string;
  ink: string;
  accent: string;
  radius: number;
};

type SectionDraft = {
  id: string;
  type: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  mediaType: MediaType;
  mediaUrl: string;
  visible: boolean;
};

type BuilderPayload = {
  page: string;
  theme: ThemeDraft;
  sections: SectionDraft[];
  updatedAt: string;
};

type ThemeColorKey = Exclude<keyof ThemeDraft, "radius">;

const colorControls: { key: ThemeColorKey; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "panel", label: "Panel" },
  { key: "primary", label: "Primary" },
  { key: "ink", label: "Ink" },
  { key: "accent", label: "Accent" },
];

const pages = [
  { label: "Homepage", value: "home", href: "/" },
  { label: "Buyer homepage", value: "buyer", href: "/?path=buyer" },
  { label: "Manufacturer homepage", value: "seller", href: "/?path=seller" },
  { label: "Our Story", value: "about", href: "/about" },
  { label: "Marketplace", value: "marketplace", href: "/marketplace" },
];

const defaultTheme: ThemeDraft = {
  background: "#f8f1e7",
  panel: "#fffaf1",
  primary: "#52653f",
  ink: "#171512",
  accent: "#c39143",
  radius: 30,
};

const sectionLibrary: SectionDraft[] = [
  {
    id: "hero",
    type: "Hero",
    eyebrow: "Origino",
    title: "Selected manufacturers, shown with proof.",
    body: "Set the first screen, headline, primary media, and path-specific call to action.",
    cta: "Apply to be selected",
    href: "/ai-audit",
    mediaType: "image",
    mediaUrl: "",
    visible: true,
  },
  {
    id: "editorial-split",
    type: "Editorial Split",
    eyebrow: "Story",
    title: "Manufacturing exists. Visibility is broken.",
    body: "Use this for a two-column editorial section with image or video support.",
    cta: "Understand how it works",
    href: "/about",
    mediaType: "image",
    mediaUrl: "",
    visible: true,
  },
  {
    id: "metrics",
    type: "Metrics",
    eyebrow: "Signals",
    title: "Proof before conversation.",
    body: "Use restrained numbers only when they explain verification, response, or export readiness.",
    cta: "",
    href: "",
    mediaType: "none",
    mediaUrl: "",
    visible: true,
  },
  {
    id: "supplier-cards",
    type: "Supplier Cards",
    eyebrow: "Selected work",
    title: "A smaller list, better understood.",
    body: "Feature selected manufacturers without flooding the page with marketplace noise.",
    cta: "See selected manufacturers",
    href: "/marketplace",
    mediaType: "image",
    mediaUrl: "",
    visible: true,
  },
  {
    id: "tools-grid",
    type: "Tools Grid",
    eyebrow: "Tools",
    title: "Compare, calculate, and prepare.",
    body: "Group buyer utilities like comparison, landed cost, logistics, and export guides.",
    cta: "Open tools",
    href: "/compare",
    mediaType: "none",
    mediaUrl: "",
    visible: true,
  },
  {
    id: "media-story",
    type: "Media Story",
    eyebrow: "Film",
    title: "Show the work without noise.",
    body: "A flexible media section for founder video, workshop imagery, or campaign footage.",
    cta: "",
    href: "",
    mediaType: "video",
    mediaUrl: "",
    visible: true,
  },
  {
    id: "cta",
    type: "CTA",
    eyebrow: "Next",
    title: "Choose the path that fits.",
    body: "End a page with one focused action, not a row of competing links.",
    cta: "Start",
    href: "/register",
    mediaType: "none",
    mediaUrl: "",
    visible: true,
  },
];

const storageKey = "origino-site-builder-draft";

function cloneSection(section: SectionDraft) {
  return {
    ...section,
    id: `${section.type.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
  };
}

function pageHref(value: string) {
  return pages.find((page) => page.value === value)?.href ?? "/";
}

export default function AdminSiteBuilderPage() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useState<ThemeDraft>(defaultTheme);
  const [sections, setSections] = useState<SectionDraft[]>(() => sectionLibrary.slice(0, 3).map(cloneSection));
  const [selectedTemplate, setSelectedTemplate] = useState(sectionLibrary[0].type);
  const [selectedId, setSelectedId] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    setSelectedId((current) => current || sections[0]?.id || "");
  }, [sections]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as Partial<BuilderPayload>;
      if (typeof parsed.page === "string") setPage(parsed.page);
      if (parsed.theme) setTheme({ ...defaultTheme, ...parsed.theme });
      if (Array.isArray(parsed.sections) && parsed.sections.length > 0) {
        setSections(parsed.sections);
        setSelectedId(parsed.sections[0].id);
      }
    } catch {
      toast.error("Saved draft could not be loaded");
    }
  }, []);

  const selectedSection = sections.find((section) => section.id === selectedId);
  const visibleSections = useMemo(() => sections.filter((section) => section.visible), [sections]);
  const previewStyle = {
    "--builder-bg": theme.background,
    "--builder-panel": theme.panel,
    "--builder-primary": theme.primary,
    "--builder-ink": theme.ink,
    "--builder-accent": theme.accent,
    "--builder-radius": `${theme.radius}px`,
  } as CSSProperties;

  function updateTheme(patch: Partial<ThemeDraft>) {
    setTheme((current) => ({ ...current, ...patch }));
  }

  function updateThemeColor(key: ThemeColorKey, value: string) {
    setTheme((current) => ({ ...current, [key]: value }));
  }

  function updateSection(id: string, patch: Partial<SectionDraft>) {
    setSections((current) => current.map((section) => (section.id === id ? { ...section, ...patch } : section)));
  }

  function addSection(type = selectedTemplate) {
    const template = sectionLibrary.find((section) => section.type === type) ?? sectionLibrary[0];
    const section = cloneSection(template);
    setSections((current) => [...current, section]);
    setSelectedId(section.id);
  }

  function removeSection(id: string) {
    const next = sections.filter((section) => section.id !== id);
    setSections(next);
    setSelectedId((current) => (current === id ? next[0]?.id ?? "" : current));
  }

  function move(index: number, direction: -1 | 1) {
    setSections((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function saveDraft() {
    const payload: BuilderPayload = { page, theme, sections, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    toast.success("Draft saved");
  }

  function resetDraft() {
    setTheme(defaultTheme);
    const next = sectionLibrary.slice(0, 3).map(cloneSection);
    setSections(next);
    setSelectedId(next[0]?.id ?? "");
    toast.success("Builder reset");
  }

  function handleFile(sectionId: string, file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      updateSection(sectionId, {
        mediaUrl: reader.result,
        mediaType: file.type.startsWith("video/") ? "video" : "image",
      });
      toast.success("Media added to draft");
    };
    reader.readAsDataURL(file);
  }

  async function publish() {
    if (sections.length === 0) {
      toast.error("Add at least one section before publishing");
      return;
    }

    setPublishing(true);
    const payload: BuilderPayload = { page, theme, sections, updatedAt: new Date().toISOString() };
    const response = await fetch("/api/admin/site-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await response.json()) as {
      success: boolean;
      data?: { count: number; previewUrl: string };
      error?: string;
    };
    setPublishing(false);

    if (!json.success) {
      toast.error(json.error ?? "Publish failed");
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    toast.success(`Published ${json.data?.count ?? sections.length} sections`);
  }

  return (
    <div className="space-y-8">
      <section className="panel-soft p-6 sm:p-8">
        <p className="badge-patch mb-4">Visual Site Builder</p>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-3xl sm:text-5xl">Edit pages without touching code.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5a5a54] sm:text-base">
              Build a page stack, tune the live theme, add images or video, then publish the same payload the Supabase page sections table will store.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="btn-pill btn-pill-outline min-h-[44px]" href={pageHref(page)} target="_blank" rel="noreferrer">
              Open Preview
            </a>
            <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={saveDraft} type="button">
              Save Draft
            </button>
            <button className="btn-pill btn-pill-forest min-h-[44px]" disabled={publishing} onClick={publish} type="button">
              {publishing ? "Publishing..." : "Publish Changes"}
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 2xl:grid-cols-[360px_minmax(0,1fr)_360px]">
        <aside className="panel-soft h-fit p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl">Sections</h2>
            <button className="btn-pill btn-pill-outline min-h-[44px] px-4" onClick={resetDraft} type="button">
              Reset
            </button>
          </div>

          <label className="small-caps mt-5 block text-xs" htmlFor="builder-page">Page</label>
          <select id="builder-page" className="input-editorial mt-2" value={page} onChange={(event) => setPage(event.target.value)}>
            {pages.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>

          <label className="small-caps mt-5 block text-xs" htmlFor="builder-template">Add Section</label>
          <div className="mt-2 flex gap-2">
            <select id="builder-template" className="input-editorial" value={selectedTemplate} onChange={(event) => setSelectedTemplate(event.target.value)}>
              {sectionLibrary.map((section) => (
                <option key={section.type} value={section.type}>{section.type}</option>
              ))}
            </select>
            <button className="btn-pill btn-pill-forest min-h-[44px] px-4" onClick={() => addSection()} type="button">
              Add
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {sections.map((section, index) => (
              <div className={`rounded-[24px] border p-3 ${selectedId === section.id ? "border-[var(--forest)] bg-[var(--forest-pale)]" : "border-[rgba(26,26,24,0.12)] bg-[rgba(255,255,255,0.45)]"}`} key={section.id}>
                <button className="min-h-[44px] w-full text-start" onClick={() => setSelectedId(section.id)} type="button">
                  <span className="small-caps block text-xs">{section.type}</span>
                  <span className="mt-1 block font-semibold">{section.title || "Untitled section"}</span>
                </button>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-pill btn-pill-outline min-h-[44px] px-4" disabled={index === 0} onClick={() => move(index, -1)} type="button">Up</button>
                  <button className="btn-pill btn-pill-outline min-h-[44px] px-4" disabled={index === sections.length - 1} onClick={() => move(index, 1)} type="button">Down</button>
                  <button className="btn-pill btn-pill-outline min-h-[44px] px-4" onClick={() => updateSection(section.id, { visible: !section.visible })} type="button">
                    {section.visible ? "Hide" : "Show"}
                  </button>
                  <button className="btn-pill btn-pill-outline min-h-[44px] px-4" onClick={() => removeSection(section.id)} type="button">Remove</button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="panel-soft min-h-[720px] p-4 sm:p-6" style={previewStyle}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="small-caps text-xs">Live Preview</p>
              <p className="text-sm text-[#5a5a54]">{pages.find((item) => item.value === page)?.label}</p>
            </div>
            <div className="flex gap-2">
              <button className={`btn-pill min-h-[44px] px-4 ${previewMode === "desktop" ? "btn-pill-forest" : "btn-pill-outline"}`} onClick={() => setPreviewMode("desktop")} type="button">Desktop</button>
              <button className={`btn-pill min-h-[44px] px-4 ${previewMode === "mobile" ? "btn-pill-forest" : "btn-pill-outline"}`} onClick={() => setPreviewMode("mobile")} type="button">Mobile</button>
            </div>
          </div>

          <div className={`mx-auto overflow-hidden border border-[rgba(26,26,24,0.12)] bg-[var(--builder-bg)] shadow-[0_28px_80px_rgba(26,26,24,0.08)] ${previewMode === "mobile" ? "max-w-[390px]" : "max-w-6xl"}`} style={{ borderRadius: "var(--builder-radius)" }}>
            <div className="flex items-center justify-between border-b border-[rgba(26,26,24,0.1)] bg-[rgba(255,255,255,0.48)] px-5 py-4">
              <span className="small-caps text-xs">ORIGINO</span>
              <span className="small-caps text-xs">{visibleSections.length} live sections</span>
            </div>
            <div className="space-y-4 p-4 sm:p-6">
              {visibleSections.length === 0 && (
                <div className="rounded-[24px] border border-dashed border-[rgba(26,26,24,0.18)] p-8 text-center text-sm text-[#5a5a54]">
                  All sections are hidden. Show a section or add a new one to preview the page.
                </div>
              )}
              {visibleSections.map((section, index) => (
                <article className="grid gap-5 bg-[var(--builder-panel)] p-5 shadow-[0_20px_50px_rgba(26,26,24,0.06)] lg:grid-cols-[1.1fr_0.9fr]" key={section.id} style={{ borderRadius: "calc(var(--builder-radius) - 6px)" }}>
                  <div>
                    <p className="badge-patch border-[var(--builder-accent)] text-[var(--builder-primary)]">{section.eyebrow || section.type}</p>
                    <h3 className="mt-4 text-3xl leading-[0.95] text-[var(--builder-ink)] sm:text-5xl">{section.title || `${section.type} section`}</h3>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5a5a54]">{section.body || "Add copy in the inspector."}</p>
                    {section.cta && (
                      <a className="btn-pill btn-pill-forest mt-5 inline-flex min-h-[44px]" href={section.href || "#"}>
                        {section.cta}
                      </a>
                    )}
                  </div>
                  <div className="min-h-[220px] overflow-hidden bg-[rgba(26,26,24,0.04)]" style={{ borderRadius: "calc(var(--builder-radius) - 12px)" }}>
                    {section.mediaUrl ? (
                      section.mediaType === "video" ? (
                        <video className="h-full min-h-[220px] w-full object-cover" controls muted src={section.mediaUrl} />
                      ) : (
                        <img alt="" className="h-full min-h-[220px] w-full object-cover" src={section.mediaUrl} />
                      )
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center p-6 text-center text-sm text-[#6b6b68]">
                        {index === 0 ? "Hero media preview" : "Add image or video"}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>

        <aside className="panel-soft h-fit p-5">
          <h2 className="text-2xl">Inspector</h2>
          {!selectedSection ? (
            <p className="mt-4 text-sm text-[#5a5a54]">Select or add a section to edit it.</p>
          ) : (
            <div className="mt-5 space-y-4">
              <div>
                <label className="small-caps block text-xs" htmlFor="section-eyebrow">Eyebrow</label>
                <input id="section-eyebrow" className="input-editorial mt-2" value={selectedSection.eyebrow} onChange={(event) => updateSection(selectedSection.id, { eyebrow: event.target.value })} />
              </div>
              <div>
                <label className="small-caps block text-xs" htmlFor="section-title">Title</label>
                <textarea id="section-title" className="input-editorial mt-2 min-h-[92px]" value={selectedSection.title} onChange={(event) => updateSection(selectedSection.id, { title: event.target.value })} />
              </div>
              <div>
                <label className="small-caps block text-xs" htmlFor="section-body">Body</label>
                <textarea id="section-body" className="input-editorial mt-2 min-h-[120px]" value={selectedSection.body} onChange={(event) => updateSection(selectedSection.id, { body: event.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="small-caps block text-xs" htmlFor="section-cta">CTA</label>
                  <input id="section-cta" className="input-editorial mt-2" value={selectedSection.cta} onChange={(event) => updateSection(selectedSection.id, { cta: event.target.value })} />
                </div>
                <div>
                  <label className="small-caps block text-xs" htmlFor="section-href">Link</label>
                  <input id="section-href" className="input-editorial mt-2" value={selectedSection.href} onChange={(event) => updateSection(selectedSection.id, { href: event.target.value })} />
                </div>
              </div>
              <div>
                <label className="small-caps block text-xs" htmlFor="media-type">Media Type</label>
                <select id="media-type" className="input-editorial mt-2" value={selectedSection.mediaType} onChange={(event) => updateSection(selectedSection.id, { mediaType: event.target.value as MediaType })}>
                  <option value="none">None</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
              <div>
                <label className="small-caps block text-xs" htmlFor="media-url">Image or Video URL</label>
                <input id="media-url" className="input-editorial mt-2" value={selectedSection.mediaUrl} onChange={(event) => updateSection(selectedSection.id, { mediaUrl: event.target.value })} />
              </div>
              <div>
                <label className="small-caps block text-xs" htmlFor="media-file">Upload Draft Media</label>
                <input id="media-file" className="mt-2 min-h-[44px] w-full rounded-full border border-[rgba(26,26,24,0.16)] bg-white/40 px-4 py-3 text-sm" type="file" accept="image/*,video/*" onChange={(event) => handleFile(selectedSection.id, event.target.files?.[0])} />
              </div>

              <div className="border-t border-[rgba(26,26,24,0.12)] pt-5">
                <h3 className="text-xl">Theme</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {colorControls.map(({ key, label }) => (
                    <label className="small-caps text-xs" key={key}>
                      {label}
                      <input className="mt-2 h-11 w-full rounded-full border border-[rgba(26,26,24,0.12)] bg-transparent p-1" type="color" value={theme[key]} onChange={(event) => updateThemeColor(key, event.target.value)} />
                    </label>
                  ))}
                </div>
                <label className="small-caps mt-4 block text-xs" htmlFor="radius">Corner Radius</label>
                <input id="radius" className="mt-2 w-full accent-[var(--forest)]" min="8" max="44" type="range" value={theme.radius} onChange={(event) => updateTheme({ radius: Number(event.target.value) })} />
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
