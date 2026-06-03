import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-[0_12px_40px_rgba(11,31,42,0.08)]">
        <p className="font-mono text-[10px] uppercase tracking-widest text-sea">
          OSI Admin
        </p>
        <h1 className="mt-2 font-display text-2xl text-ink">Content Dashboard</h1>
        <p className="mt-2 font-sans text-sm text-ink-muted">
          Sign in to manage RFQ inquiries, products, and site copy.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
