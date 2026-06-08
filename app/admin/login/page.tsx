import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { LoginShell } from "@/components/admin/LoginShell";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <LoginShell>
      <LoginForm />
    </LoginShell>
  );
}
