import CompareClient from "./CompareClient";
import { getSuppliers } from "@/lib/data-service";

export default async function ComparePage() {
  return <CompareClient suppliers={await getSuppliers()} initialIds={[]} />;
}
