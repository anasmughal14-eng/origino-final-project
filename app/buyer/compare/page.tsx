import CompareClient from "@/app/compare/CompareClient";
import { getSuppliers } from "@/lib/data-service";

export default async function BuyerComparePage() {
  const suppliers = await getSuppliers();
  return <CompareClient suppliers={suppliers} initialIds={suppliers.slice(0, 3).map((supplier) => supplier.id)} />;
}
