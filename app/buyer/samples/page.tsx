import { getProducts } from "@/lib/data-service";
import BuyerSamplesClient from "./BuyerSamplesClient";

export default async function BuyerSamplesPage() {
  return <BuyerSamplesClient products={(await getProducts()).filter((product) => product.sample_available).slice(0, 6)} />;
}
