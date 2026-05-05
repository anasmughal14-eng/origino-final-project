import { notFound } from "next/navigation";
import { getCommunityPostById } from "@/lib/data-service";

export default async function CommunityPostPage({ params }: { params: { id: string } }) {
  const post = await getCommunityPostById(params.id);
  if (!post) notFound();
  const comments = [
    { author: "Verified Exporter", body: "Add issuing authority links and sample document names to make the advice actionable." },
    { author: "Buyer", body: "This is exactly the detail procurement teams ask for before sampling." },
  ];
  return (
    <article className="container-editorial pt-28 pb-16">
      <p className="badge-patch">{post.category}</p>
      <h1 className="mt-5 max-w-4xl text-5xl">{post.title}</h1>
      <p className="mt-8 max-w-3xl text-lg leading-8">{post.body}</p>
      <h2 className="mt-12 text-3xl">Threaded Comments</h2>
      <div className="mt-5 space-y-3">{comments.map((comment) => <div className="border p-4" key={comment.body}><strong>{comment.author}</strong><p className="mt-2 text-[#5a5a54]">{comment.body}</p></div>)}</div>
    </article>
  );
}
