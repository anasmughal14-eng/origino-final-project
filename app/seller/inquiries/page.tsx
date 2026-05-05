import SellerInquiriesClient from "./SellerInquiriesClient";
import { getInquiries } from "@/lib/data-service";
import { Suspense } from "react";

export default async function SellerInquiriesPage() {
  return <Suspense fallback={<div className="border p-5">Loading inquiries...</div>}><SellerInquiriesClient inquiries={await getInquiries()} /></Suspense>;
}
