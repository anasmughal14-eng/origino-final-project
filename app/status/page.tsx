import ToolPage from "@/app/components/shared/ToolPage";

export default function StatusPage() {
  return <ToolPage title="Platform Status" description="Public health and operational status for marketplace, portal, API, email, payment, and Supabase connectivity." metrics={[{ label: "Public pages", value: "Online" }, { label: "Local APIs", value: "Online" }, { label: "Supabase", value: "Pending" }]} items={[{ title: "Current mode", body: "The app is running with local data and local API stubs." }, { title: "Production mode", body: "After Supabase and Vercel are connected, this page can show live service health." }]} />;
}
