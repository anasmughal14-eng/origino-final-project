import ToolPage from "@/app/components/shared/ToolPage";

export default function PrivacyPage() {
  return <ToolPage eyebrow="Legal" title="Privacy Policy" description="Privacy coverage for profiles, company data, inquiries, documents, audit submissions, analytics, and Supabase-connected storage." items={[{ title: "Data use", body: "Local data mode stores no real Supabase records; production mode will use role-based access and RLS policies." }, { title: "Deletion workflow", body: "Admin data-deletion tools are represented in the admin portal." }]} />;
}
