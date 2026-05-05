import Link from "next/link";
import { notFound } from "next/navigation";
import InquiryForm from "@/app/components/shared/InquiryForm";
import SupplierVerificationBadgeClient from "@/app/components/shared/SupplierVerificationBadgeClient";
import { getProducts, getSupplierBySlug } from "@/lib/data-service";

const SUPPLIER_IMAGE_FALLBACKS: Record<string, string> = {
  sialkot: "https://images.pexels.com/photos/27383631/pexels-photo-27383631.jpeg?auto=compress&cs=tinysrgb&w=1400",
  faisalabad: "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg?auto=compress&cs=tinysrgb&w=1400",
  lahore: "https://images.pexels.com/photos/1094767/pexels-photo-1094767.jpeg?auto=compress&cs=tinysrgb&w=1400",
  karachi: "https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=1400",
  gujranwala: "https://images.pexels.com/photos/18469652/pexels-photo-18469652.jpeg?auto=compress&cs=tinysrgb&w=1400",
};

export default async function SupplierPage({ params }: { params: { slug: string } }) {
  const supplier = await getSupplierBySlug(params.slug);
  if (!supplier) notFound();
  const products = (await getProducts()).filter((product) => product.supplier_id === supplier.id);

  const imageUrl = supplier.hero_image_url || SUPPLIER_IMAGE_FALLBACKS[supplier.cluster] || SUPPLIER_IMAGE_FALLBACKS.sialkot;

  return (
    <div className="container-editorial pb-16 pt-32">
      <section className="relative mb-10 overflow-hidden rounded-[32px] bg-[#1a1a18]">
        <img src={imageUrl} alt="" aria-hidden="true" className="h-[420px] w-full object-cover opacity-62" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,26,24,0.78),rgba(26,26,24,0.18))]" />
        <div className="absolute inset-0 flex items-end p-6 md:p-10">
          <div className="max-w-3xl text-[#fefdfb]">
            <SupplierVerificationBadgeClient supplierId={supplier.id} tier={supplier.verification_tier} />
            <h1 className="mt-5 text-5xl text-[#fefdfb] md:text-7xl">{supplier.company_name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#e8e4da]">{supplier.description}</p>
          </div>
        </div>
      </section>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <section>
          <div className="border-b border-[rgba(26,26,24,0.12)] pb-8">
            <p className="badge-patch">{supplier.city} / {supplier.category}</p>
            <h2 className="mt-5 text-4xl">Evidence</h2>
            <p className="mt-4 text-lg leading-8 text-[#5a5a54]">Documents, response behaviour, audit score, and trade terms in one place.</p>
            <div className="mt-6 flex flex-wrap gap-2">{supplier.certifications.map((cert) => <span className="badge-patch" key={cert}>{cert}</span>)}</div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="border border-[rgba(26,26,24,0.14)] p-4"><p className="metric-numeral text-2xl">{supplier.audit_score}</p><p className="text-sm text-[#5a5a54]">Audit score</p></div>
            <div className="border border-[rgba(26,26,24,0.14)] p-4"><p className="metric-numeral text-2xl">{supplier.response_rate}%</p><p className="text-sm text-[#5a5a54]">Response rate</p></div>
            <div className="border border-[rgba(26,26,24,0.14)] p-4"><p className="metric-numeral text-2xl">${supplier.moq_usd?.toLocaleString()}</p><p className="text-sm text-[#5a5a54]">MOQ</p></div>
            <div className="border border-[rgba(26,26,24,0.14)] p-4"><p className="metric-numeral text-2xl">{supplier.lead_time_days}</p><p className="text-sm text-[#5a5a54]">Lead days</p></div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="border border-[rgba(26,26,24,0.14)] p-5">
              <h2 className="text-2xl">Export readiness</h2>
              <p className="mt-3 text-sm leading-6 text-[#5a5a54]">Ships to {supplier.export_countries.join(", ")} with {supplier.payment_terms.join(", ")} terms.</p>
            </div>
            <div className="border border-[rgba(26,26,24,0.14)] p-5">
              <h2 className="text-2xl">Cluster</h2>
              <p className="mt-3 text-sm leading-6 text-[#5a5a54]">{supplier.city} · {supplier.category}</p>
            </div>
          </div>

          <h2 className="mt-12 text-3xl">Products</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {products.map((product) => <Link className="border border-[rgba(26,26,24,0.16)] p-5 transition hover:border-[#2d4a3e]" key={product.id} href={`/products/${product.slug}`}><h3 className="text-xl">{product.name}</h3><p className="mt-2 text-sm text-[#5a5a54]">{product.hs_code} · MOQ {product.moq} {product.moq_unit}</p><p className="mt-3 metric-numeral text-sm">${product.price_usd_min} - ${product.price_usd_max}</p></Link>)}
          </div>
        </section>
        <aside className="panel-soft h-fit p-5">
          <h2 className="text-2xl">Send an inquiry</h2>
          <p className="mt-2 text-sm text-[#5a5a54]">Usually answers in {supplier.response_time_hours} hours.</p>
          <div className="mt-5"><InquiryForm supplierId={supplier.id} /></div>
          <Link href={`/register?role=buyer&redirect=${encodeURIComponent(`/buyer/quotes?supplier=${supplier.id}`)}`} className="btn-pill btn-pill-outline mt-5 min-h-[44px] w-full">Request a quote</Link>
        </aside>
      </div>
    </div>
  );
}
