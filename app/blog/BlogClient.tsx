"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/types/database";

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const [tag, setTag] = useState("all");
  const tags = ["all", ...Array.from(new Set(posts.flatMap((post) => post.tags)))];
  const filtered = useMemo(() => tag === "all" ? posts : posts.filter((post) => post.tags.includes(tag)), [posts, tag]);
  return (
    <div className="container-editorial pt-28 pb-16">
      <h1 className="text-5xl">Journal</h1>
      <div className="mt-6 flex flex-wrap gap-2">{tags.map((item) => <button className="btn-pill btn-pill-outline min-h-[44px]" key={item} onClick={() => setTag(item)}>{item}</button>)}</div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">{filtered.map((post) => (
        <Link className="block border border-[rgba(26,26,24,0.16)] p-5" key={post.id} href={`/blog/${post.slug}`}>
          <h2 className="text-3xl">{post.title}</h2>
          <p className="mt-3 text-[#5a5a54]">{post.excerpt}</p>
        </Link>
      ))}</div>
    </div>
  );
}
