"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminSiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin site settings error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="font-display text-lg text-red-900">Could not load site settings</h2>
      <p className="font-sans text-sm text-red-800">
        {error.message || "Something went wrong while loading this page."}
      </p>
      <p className="font-sans text-xs text-red-700/80">
        Try a hard refresh (Ctrl+Shift+R). If you just deployed, wait a moment and reload so
        the browser picks up the latest build.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    </div>
  );
}
