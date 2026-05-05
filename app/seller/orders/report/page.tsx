import Link from "next/link";
import SellerOrderReportForm from "./SellerOrderReportForm";

export default function SellerOrderReportPage() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="badge-patch mb-3">Commission Workflow</p>
          <h1 className="text-4xl">Report Off-Platform Order</h1>
          <p className="mt-3 max-w-3xl text-[#5a5a54]">
            Report closed deals so ORIGINO can send the buyer confirmation request, lock commission context, and create an admin follow-up if the buyer does not confirm.
          </p>
        </div>
        <Link className="btn-pill btn-pill-outline min-h-[44px]" href="/seller/orders">View Orders</Link>
      </div>
      <SellerOrderReportForm />
    </div>
  );
}
