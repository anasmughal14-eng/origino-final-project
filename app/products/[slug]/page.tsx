import { notFound } from "next/navigation";
import ProductInquiryPanel from "@/app/components/shared/ProductInquiryPanel";
import { getProductBySlug, getSuppliers } from "@/lib/data-service";

const PRODUCT_IMAGE_FALLBACK = "https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=1400";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const supplier = (await getSuppliers()).find((item) => item.id === product.supplier_id);
  if (!supplier) notFound();
  const incoterms = ["FOB"];
  const imageUrl = product.images[0] || supplier.hero_image_url || PRODUCT_IMAGE_FALLBACK;

  return (
    <div className="container-editorial pb-16 pt-32">
      <section className="mb-10 grid overflow-hidden rounded-[32px] bg-[#fefdfb] shadow-[0_18px_70px_rgba(0,0,0,0.06)] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-h-[420px] overflow-hidden bg-[#e8e4da]">
          <img src={imageUrl} alt={product.name} className="h-full min-h-[420px] w-full object-cover" />
        </div>
        <div className="flex flex-col justify-end p-6 md:p-10">
          <p className="badge-patch">{product.category}</p>
          <h1 className="mt-5 text-5xl md:text-7xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-[#5a5a54]">{product.description}</p>
          <p className="mt-5 metric-numeral text-2xl">${product.price_usd_min} - ${product.price_usd_max}</p>
        </div>
      </section>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="badge-patch">Product record</p>
          <h2 className="mt-5 text-4xl">Specifications</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="border border-[rgba(26,26,24,0.14)] p-4">
              <p className="metric-numeral text-xl">{product.moq}</p>
              <p className="text-sm text-[#5a5a54]">MOQ {product.moq_unit}</p>
            </div>
            <div className="border border-[rgba(26,26,24,0.14)] p-4">
              <p className="metric-numeral text-xl">{product.lead_time_days}</p>
              <p className="text-sm text-[#5a5a54]">Lead days</p>
            </div>
            <div className="border border-[rgba(26,26,24,0.14)] p-4">
              <p className="metric-numeral text-xl">{incoterms.join(", ")}</p>
              <p className="text-sm text-[#5a5a54]">Incoterms</p>
            </div>
          </div>
          <div className="mt-8 overflow-hidden border border-[rgba(26,26,24,0.16)]">
            <table className="w-full text-sm">
              <tbody>{Object.entries(product.specifications).map(([key, value]) => <tr className="border-b border-[rgba(26,26,24,0.1)]" key={key}><th className="p-3 text-start">{key}</th><td className="p-3 text-[#5a5a54]">{value}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
        <ProductInquiryPanel supplierId={supplier.id} supplierName={supplier.company_name} supplierSlug={supplier.slug} productId={product.id} productName={product.name} sampleAvailable={product.sample_available} />
      </div>
    </div>
  );
}
