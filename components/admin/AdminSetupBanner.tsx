import Link from "next/link";
import { AlertCircle } from "lucide-react";

type AdminSetupBannerProps = {
  message?: string;
};

export function AdminSetupBanner({ message }: AdminSetupBannerProps) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-6 py-4 lg:px-8">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" />
        <div className="space-y-2 font-sans text-sm text-amber-950">
          <p className="font-medium">Firestore not connected — dashboard data is read-only until setup is complete.</p>
          {message ? <p>{message}</p> : null}
          <ol className="list-inside list-decimal space-y-1 text-amber-900/90">
            <li>
              Firebase Console → <strong>osi-project-da298</strong> → <strong>Firestore Database</strong> →
              Create database (if you see &quot;5 NOT_FOUND&quot;, this step is missing)
            </li>
            <li>
              Project settings → Service accounts → Generate new private key
            </li>
            <li>
              Save as <code className="rounded bg-amber-100/80 px-1">firebase-service-account.json</code> in the
              project root
            </li>
            <li>
              In <code className="rounded bg-amber-100/80 px-1">.env.local</code> set{" "}
              <code className="rounded bg-amber-100/80 px-1">FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json</code>
            </li>
            <li>Restart the dev server</li>
          </ol>
          <p>
            <Link href="/admin" className="font-medium underline underline-offset-2">
              Overview
            </Link>{" "}
            shows full stats once connected. Sign-in already works.
          </p>
        </div>
      </div>
    </div>
  );
}
