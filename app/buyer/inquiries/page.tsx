import BuyerInquiriesClient from "@/app/buyer/inquiries/BuyerInquiriesClient";
import { getInquiries } from "@/lib/data-service";
import { Suspense } from "react";

export default async function BuyerInquiriesPage() {
  return <Suspense fallback={<div className="border p-5">Loading inquiries...</div>}><BuyerInquiriesClient inquiries={await getInquiries()} /></Suspense>;
}
