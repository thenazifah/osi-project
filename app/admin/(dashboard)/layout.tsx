import { redirect } from "next/navigation";
import { AdminSetupBanner } from "@/components/admin/AdminSetupBanner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminSessionEmail, isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminNavCounts } from "@/lib/admin-actions";
import { getAdminConfigStatus } from "@/lib/firebase-admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const adminStatus = getAdminConfigStatus();
  const email = await getAdminSessionEmail();
  const navCounts = adminStatus.ready
    ? await getAdminNavCounts().catch(() => ({
        rfqNew: 0,
        rfqTotal: 0,
        productCount: 0,
        contentLocales: 0,
      }))
    : { rfqNew: 0, rfqTotal: 0, productCount: 0, contentLocales: 0 };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar
        email={email}
        firebaseReady={adminStatus.ready}
        navCounts={navCounts}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {!adminStatus.ready ? (
          <AdminSetupBanner message={adminStatus.message} />
        ) : null}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
