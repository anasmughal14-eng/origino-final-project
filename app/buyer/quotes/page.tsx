import BuyerQuotesClient from "@/app/buyer/quotes/BuyerQuotesClient";
import { getQuotes } from "@/lib/data-service";
import { Suspense } from "react";

export default async function BuyerQuotesPage() {
  const quotes = await getQuotes();
  return <Suspense fallback={<div className="border p-5">Loading quotes...</div>}><BuyerQuotesClient quotes={quotes} /></Suspense>;
}
