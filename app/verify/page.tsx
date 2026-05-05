import ToolPage from "@/app/components/shared/ToolPage";

export default function VerifyPage() {
  return <ToolPage eyebrow="Auth" title="Verify Account" description="Account verification flow ready for Supabase email verification and profile activation." actions={[{ href: "/login", label: "Back to Login" }]} />;
}
