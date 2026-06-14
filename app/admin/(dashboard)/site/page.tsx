import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SiteSettingsEditor } from "@/components/admin/SiteSettingsEditor";
import { getSiteSettings } from "@/lib/admin-actions";
import { defaultSiteSettings } from "@/lib/site-settings";
import { isAdminConfigured } from "@/lib/firebase-admin";

export default async function AdminSitePage() {
  const firebaseReady = isAdminConfigured();

  if (!firebaseReady) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          eyebrow="Site"
          title="Site settings"
          description="Connect Firestore to manage Meta Pixel, social links, and homepage imagery from the dashboard."
        />
      </div>
    );
  }

  let settings = defaultSiteSettings();
  let error: string | null = null;

  try {
    settings = await getSiteSettings();
    // Ensure only JSON-serializable props reach the client editor.
    settings = JSON.parse(JSON.stringify(settings)) as typeof settings;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load site settings";
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Site"
        title="Site settings"
        description="Meta Pixel, social links, and site images sync to the landing page and product sections."
      />

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {error}
        </p>
      ) : (
        <SiteSettingsEditor initialSettings={settings} />
      )}
    </div>
  );
}
