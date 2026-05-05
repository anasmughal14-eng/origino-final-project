import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/data-service";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();
  return (
    <article className="container-editorial pt-28 pb-16">
      <Link href="/blog" className="nav-link">Back to Journal</Link>
      <h1 className="mt-6 max-w-4xl text-5xl">{post.title}</h1>
      <div className="mt-8 max-w-3xl space-y-6 text-lg leading-8">{post.body.split("\n").filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
    </article>
  );
}
