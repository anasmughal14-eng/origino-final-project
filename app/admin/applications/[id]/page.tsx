import { notFound } from "next/navigation";
import { getApplicationById } from "@/lib/data-service";
import AdminApplicationDetailClient from "./AdminApplicationDetailClient";

export default async function AdminApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await getApplicationById(params.id);
  if (!application) notFound();
  return <AdminApplicationDetailClient application={application} />;
}
