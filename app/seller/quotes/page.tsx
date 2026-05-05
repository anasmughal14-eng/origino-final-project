import SellerQuotesClient from "./SellerQuotesClient";
import { getQuotes } from "@/lib/data-service";
import { Suspense } from "react";

export default async function SellerQuotesPage() {
  return <Suspense fallback={<div className="border p-5">Loading quotes...</div>}><SellerQuotesClient quotes={await getQuotes()} /></Suspense>;
}
