import SellerOrdersClient from "./SellerOrdersClient";
import { getOrders } from "@/lib/data-service";

export default async function SellerOrdersPage() {
  const orders = await getOrders();
  return <SellerOrdersClient orders={orders} />;
}
