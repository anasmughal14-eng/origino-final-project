import Link from "next/link";
import { notFound } from "next/navigation";
import ClusterDetailLabels from "./ClusterDetailLabels";
import { getClusterBySlug, getSuppliers } from "@/lib/data-service";

export default async function ClusterPage({ params }: { params: { slug: string } }) {
  const cluster = await getClusterBySlug(params.slug);
  if (!cluster) notFound();
  const suppliers = (await getSuppliers()).filter((supplier) => supplier.cluster === cluster.slug);
  return (
    <div className="container-editorial pt-28 pb-16">
      <h1 className="text-5xl">{cluster.city}</h1>
      <p className="mt-3 text-xl text-[#5a5a54]">{cluster.tagline}</p>
      <p className="mt-6 max-w-3xl leading-8">{cluster.story}</p>
      <ClusterDetailLabels suppliers={suppliers.length} categories={cluster.primaryCategories.length} exportShare={cluster.exportShare} city={cluster.city} />
      <div className="mt-5 grid gap-4 md:grid-cols-3">{suppliers.map((supplier) => <Link className="border p-5" key={supplier.id} href={`/suppliers/${supplier.slug}`}>{supplier.company_name}</Link>)}</div>
    </div>
  );
}
