import Link from "next/link";
import { notFound } from "next/navigation";
import { getExportGuideBySlug, getExportGuides } from "@/lib/data-service";

export default async function ExportGuidePage({ params }: { params: { slug: string } }) {
  const guide = await getExportGuideBySlug(params.slug);
  if (!guide) notFound();
  const related = (await getExportGuides()).filter((item) => guide.related.includes(item.slug));
  return (
    <article className="container-editorial pt-28 pb-16">
      <p className="badge-patch">{guide.category}</p>
      <h1 className="mt-5 max-w-4xl text-5xl">{guide.title}</h1>
      <p className="mt-5 max-w-3xl text-xl leading-8 text-[#5a5a54]">{guide.summary}</p>
      <dl className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="border p-4"><dt className="text-sm text-[#5a5a54]">Authority</dt><dd>{guide.issuingAuthority}</dd></div>
        <div className="border p-4"><dt className="text-sm text-[#5a5a54]">Cost</dt><dd>{guide.costEstimate}</dd></div>
        <div className="border p-4"><dt className="text-sm text-[#5a5a54]">Time</dt><dd>{guide.timeEstimate}</dd></div>
      </dl>
      <div className="mt-10 max-w-3xl space-y-6 text-lg leading-8">{guide.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <h2 className="mt-12 text-3xl">Related Guides</h2>
      <div className="mt-4 flex flex-wrap gap-3">{related.map((item) => <Link className="btn-pill btn-pill-outline min-h-[44px]" key={item.slug} href={`/export-docs/${item.slug}`}>{item.title}</Link>)}</div>
    </article>
  );
}
