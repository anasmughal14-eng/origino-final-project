import { getOrders, getProducts, getSuppliers } from "@/lib/data-service";
import AdminOrdersClient from "./AdminOrdersClient";

export default async function AdminOrdersPage() {
  const [orders, suppliers, products] = await Promise.all([getOrders(), getSuppliers(), getProducts()]);
  return <AdminOrdersClient orders={orders} suppliers={suppliers} products={products} />;
}
