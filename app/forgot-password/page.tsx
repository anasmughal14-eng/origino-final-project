import ToolPage from "@/app/components/shared/ToolPage";

export default function ForgotPasswordPage() {
  return <ToolPage eyebrow="Auth" title="Forgot Password" description="Password reset entry point ready for Supabase Auth recovery emails." actions={[{ href: "/login", label: "Return to Login" }]} />;
}
