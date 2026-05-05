import BuyerSavedClient from "./BuyerSavedClient";
import { getProducts, getSuppliers } from "@/lib/data-service";

export default async function BuyerSavedPage() {
  return <BuyerSavedClient suppliers={(await getSuppliers()).slice(0, 3)} products={(await getProducts()).slice(0, 3)} />;
}
