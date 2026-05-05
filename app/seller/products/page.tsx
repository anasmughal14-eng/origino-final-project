import SellerProductsClient from "./SellerProductsClient";
import { getProducts } from "@/lib/data-service";

export default async function SellerProductsPage() {
  return <SellerProductsClient products={await getProducts()} />;
}
