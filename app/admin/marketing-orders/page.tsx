import { getMarketingServiceOrders, getSuppliers } from "@/lib/data-service";
import AdminMarketingOrdersClient from "./AdminMarketingOrdersClient";

export default async function AdminMarketingOrdersPage() {
  const [orders, suppliers] = await Promise.all([getMarketingServiceOrders(), getSuppliers()]);
  return <AdminMarketingOrdersClient orders={orders} suppliers={suppliers} />;
}
