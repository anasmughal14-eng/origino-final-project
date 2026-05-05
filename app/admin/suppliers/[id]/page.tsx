import { notFound } from "next/navigation";
import { getSuppliers } from "@/lib/data-service";
import AdminSupplierDetailClient from "./AdminSupplierDetailClient";

export default async function AdminSupplierDetailPage({ params }: { params: { id: string } }) {
  const suppliers = await getSuppliers();
  const supplier = suppliers.find((item) => item.id === params.id || item.slug === params.id);
  if (!supplier) notFound();
  return <AdminSupplierDetailClient supplier={supplier} />;
}
