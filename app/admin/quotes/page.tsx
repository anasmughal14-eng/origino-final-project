import { getQuotes } from "@/lib/data-service";
import AdminQuotesClient from "./AdminQuotesClient";

export default async function AdminQuotesPage() {
  return <AdminQuotesClient initialQuotes={await getQuotes()} />;
}
