"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type TemplateLanguage = "en" | "ur";

type ResponseTemplate = {
  id: string;
  title: string;
  language: TemplateLanguage;
  body: string;
  isDefault: boolean;
};

const initialTemplates: ResponseTemplate[] = [
  {
    id: "template-1",
    title: "Inquiry acknowledgement",
    language: "en",
    body: "Thank you for your inquiry. We can confirm availability and will share pricing, lead time, and certification evidence within 24 hours.",
    isDefault: true,
  },
  {
    id: "template-2",
    title: "Quote follow-up",
    language: "en",
    body: "Following up on the formal quote. The validity window is still open, and we can support documentation for your target market.",
    isDefault: false,
  },
  {
    id: "template-3",
    title: "Sample dispatch",
    language: "en",
    body: "Your sample is ready for dispatch. We will share tracking details and the document pack after courier pickup.",
    isDefault: false,
  },
];

export default function SellerResponseTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [language, setLanguage] = useState<"all" | TemplateLanguage>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editorLanguage, setEditorLanguage] = useState<TemplateLanguage>("en");
  const [editingId, setEditingId] = useState<string | null>(null);

  const visibleTemplates = useMemo(
    () => templates.filter((template) => language === "all" || template.language === language),
    [language, templates],
  );

  function editTemplate(template: ResponseTemplate) {
    setEditingId(template.id);
    setTitle(template.title);
    setBody(template.body);
    setEditorLanguage(template.language);
  }

  function resetEditor() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setEditorLanguage("en");
  }

  function saveTemplate() {
    if (!title.trim() || !body.trim()) {
      toast.error("Template title and body are required.");
      return;
    }
    if (editingId) {
      setTemplates((current) =>
        current.map((template) =>
          template.id === editingId ? { ...template, title: title.trim(), body: body.trim(), language: editorLanguage } : template,
        ),
      );
      toast.success("Template updated.");
    } else {
      setTemplates((current) => [
        ...current,
        {
          id: `template-${current.length + 1}`,
          title: title.trim(),
          body: body.trim(),
          language: editorLanguage,
          isDefault: false,
        },
      ]);
      toast.success("Template created.");
    }
    resetEditor();
  }

  function duplicateTemplate(template: ResponseTemplate) {
    setTemplates((current) => [
      ...current,
      {
        ...template,
        id: `template-${current.length + 1}`,
        title: `${template.title} copy`,
        isDefault: false,
      },
    ]);
    toast.success("Template duplicated.");
  }

  function setDefault(id: string) {
    setTemplates((current) => current.map((template) => ({ ...template, isDefault: template.id === id })));
    toast.success("Default template changed.");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Fast replies</span>
          <h1>Response Templates</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Maintain inquiry, quote, and sample reply templates so response speed stays high.
          </p>
        </div>
        <select className="input-editorial min-h-11 max-w-xs" value={language} onChange={(event) => setLanguage(event.target.value as typeof language)}>
          <option value="all">All languages</option>
          <option value="en">English</option>
          <option value="ur">Urdu</option>
        </select>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <div className="space-y-4">
          {visibleTemplates.map((template) => (
            <div className="border p-5" key={template.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-3">
                    <span className="badge-patch">{template.language === "en" ? "English" : "Urdu"}</span>
                    {template.isDefault ? <span className="badge-patch">Default</span> : null}
                  </div>
                  <h2 className="mt-3 text-2xl">{template.title}</h2>
                  <p className="mt-2 text-ink-soft">{template.body}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-pill btn-pill-outline" type="button" onClick={() => editTemplate(template)}>
                    Edit
                  </button>
                  <button className="btn-pill btn-pill-outline" type="button" onClick={() => duplicateTemplate(template)}>
                    Duplicate
                  </button>
                  <button className="btn-pill btn-pill-forest" type="button" onClick={() => setDefault(template.id)}>
                    Set Default
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border p-5">
          <h2 className="text-2xl">{editingId ? "Edit Template" : "New Template"}</h2>
          <label className="mt-5 block text-xs uppercase tracking-[0.24em] text-ink-muted">Title</label>
          <input className="input-editorial mt-2" value={title} onChange={(event) => setTitle(event.target.value)} />
          <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-ink-muted">Language</label>
          <select className="input-editorial mt-2" value={editorLanguage} onChange={(event) => setEditorLanguage(event.target.value as TemplateLanguage)}>
            <option value="en">English</option>
            <option value="ur">Urdu</option>
          </select>
          <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-ink-muted">Template body</label>
          <textarea className="input-editorial mt-2 min-h-44" value={body} onChange={(event) => setBody(event.target.value)} />
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn-pill btn-pill-forest" type="button" onClick={saveTemplate}>
              Save Template
            </button>
            <button className="btn-pill btn-pill-outline" type="button" onClick={resetEditor}>
              Reset
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
