import { notFound } from "next/navigation";
import OrderSelfReport from "./OrderSelfReport";
import { getOrderById } from "@/lib/data-service";

export default async function SellerOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  if (!order) notFound();
  const timeline = ["confirmed", "in_production", "quality_check", "shipped", "delivered"];
  return (
    <div>
      <h1 className="text-4xl">Order {order.id}</h1>
      <p className="mt-2 metric-numeral">${order.total_usd.toLocaleString()} · {order.status}</p>
      <div className="mt-8 flex flex-wrap gap-3">{timeline.map((item) => <span className={`badge-patch ${item === order.status ? "stamp-approve" : ""}`} key={item}>{item.replaceAll("_", " ")}</span>)}</div>
      <div className="mt-8 border p-5"><h2 className="text-2xl">Self Report</h2><OrderSelfReport orderId={order.id} /></div>
    </div>
  );
}
