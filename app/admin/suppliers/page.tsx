import AdminSuppliersClient from "./AdminSuppliersClient";
import { getSuppliers } from "@/lib/data-service";

export default async function AdminSuppliersPage() {
  return <AdminSuppliersClient suppliers={await getSuppliers()} />;
}
