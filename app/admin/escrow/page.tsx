import { getEscrowTransactions, getOrders } from "@/lib/data-service";
import AdminEscrowClient from "./AdminEscrowClient";

export default async function AdminEscrowPage() {
  const [transactions, orders] = await Promise.all([getEscrowTransactions(), getOrders()]);
  return <AdminEscrowClient transactions={transactions} orders={orders} />;
}
