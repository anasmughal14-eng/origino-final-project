import BuyerOrdersClient from "./BuyerOrdersClient";
import { getOrders } from "@/lib/data-service";

export default async function BuyerOrdersPage() {
  return <BuyerOrdersClient orders={await getOrders()} />;
}
