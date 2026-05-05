import AdminApplicationsClient from "./AdminApplicationsClient";
import { getApplications } from "@/lib/data-service";

export default async function AdminApplicationsPage() {
  return <AdminApplicationsClient applications={await getApplications()} />;
}
