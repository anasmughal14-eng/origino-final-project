"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { CommunityPost } from "@/types/database";

export default function CommunityClient({ posts }: { posts: CommunityPost[] }) {
  const [items, setItems] = useState(posts);
  const [category, setCategory] = useState("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", category: "export_tips", body: "" });
  const [error, setError] = useState("");
  const categories = ["all", ...Array.from(new Set(items.map((post) => post.category)))];
  const filtered = useMemo(() => category === "all" ? items : items.filter((post) => post.category === category), [category, items]);

  function publishPost(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.body.trim()) {
      setError("Title and post body are required.");
      return;
    }
    setItems((list) => [{
      id: `post-local-${Date.now()}`,
      author_id: "buyer-1",
      title: draft.title,
      body: draft.body,
      category: draft.category,
      tags: ["Community"],
      upvotes: 0,
      is_pinned: false,
      created_at: new Date().toISOString(),
    }, ...list]);
    setDraft({ title: "", category: "export_tips", body: "" });
    setError("");
    setComposerOpen(false);
    toast.success("Post published locally");
  }

  return (
    <div className="container-editorial pt-28 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-5xl">Community</h1>
        <button className="btn-pill btn-pill-forest min-h-[44px]" onClick={() => setComposerOpen((value) => !value)}>New Post</button>
      </div>
      {composerOpen && (
        <form className="mt-6 border p-5" onSubmit={publishPost}>
          <h2 className="text-2xl">New Post</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Title</span><input className="input-editorial" value={draft.title} onChange={(event) => { setError(""); setDraft({ ...draft, title: event.target.value }); }} /></label>
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Category</span><select className="input-editorial" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option value="export_tips">export_tips</option><option value="market_insights">market_insights</option><option value="q_and_a">q_and_a</option><option value="success_stories">success_stories</option></select></label>
            <label className="block md:col-span-2"><span className="mb-1 block text-xs uppercase tracking-[0.14em] text-[#8a8a82]">Body</span><textarea className="input-editorial min-h-[130px]" value={draft.body} onChange={(event) => { setError(""); setDraft({ ...draft, body: event.target.value }); }} /></label>
          </div>
          {error && <p className="mt-3 text-sm text-[#c0623a]">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-2"><button className="btn-pill btn-pill-outline min-h-[44px]" type="button" onClick={() => setComposerOpen(false)}>Cancel</button><button className="btn-pill btn-pill-forest min-h-[44px]">Publish</button></div>
        </form>
      )}
      <div className="mt-6 flex flex-wrap gap-2">{categories.map((item) => <button className="btn-pill btn-pill-outline min-h-[44px]" key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <div className="mt-8 space-y-4">{filtered.map((post) => (
        <Link className="block border border-[rgba(26,26,24,0.16)] p-5" key={post.id} href={`/community/${post.id}`}>
          <h2 className="text-2xl">{post.title}</h2>
          <p className="mt-2 text-sm text-[#5a5a54]">{post.category} · {post.upvotes} upvotes</p>
        </Link>
      ))}</div>
    </div>
  );
}
