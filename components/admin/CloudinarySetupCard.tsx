"use client";

import { CldImage } from "next-cloudinary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CloudinaryEnvStatus } from "@/lib/cloudinary-env";

const TEST_PUBLIC_ID = "main-sample";

export function CloudinarySetupCard({ status }: { status: CloudinaryEnvStatus }) {
  return (
    <Card className="border-border bg-surface">
      <CardHeader>
        <CardTitle className="text-base">Cloudinary connection</CardTitle>
        <p className="font-sans text-xs text-ink-muted">
          <code className="rounded bg-tag-bg px-1">CldImage</code> needs your{" "}
          <strong>cloud name</strong> (dashboard top-left) — not the API key alone.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="grid gap-2 font-sans text-sm sm:grid-cols-3">
          <li
            className={
              status.cloudName
                ? "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900"
                : "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900"
            }
          >
            Cloud name: {status.cloudName ?? "not set"}
          </li>
          <li
            className={
              status.apiKeySet
                ? "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900"
                : "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900"
            }
          >
            API key: {status.apiKeySet ? "configured" : "not set"}
          </li>
          <li
            className={
              status.uploadReady
                ? "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900"
                : "rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900"
            }
          >
            Uploads: {status.uploadReady ? "ready" : "needs secret or preset"}
          </li>
        </ul>

        {!status.cloudName ? (
          <div className="rounded-lg border border-border bg-tag-bg px-4 py-3 font-mono text-xs text-ink">
            <p className="mb-2 font-sans text-sm text-ink-muted">
              Add to <code>.env.local</code> and restart <code>npm run dev</code>:
            </p>
            {`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=495888938563587
CLOUDINARY_API_SECRET=your_api_secret`}
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="overflow-hidden rounded-lg border border-border bg-tag-bg">
              <CldImage
                src={TEST_PUBLIC_ID}
                width={500}
                height={500}
                alt="Cloudinary test image"
                className="h-auto max-w-full"
              />
            </div>
            <div className="font-sans text-xs text-ink-muted">
              <p>
                Live preview of <code>{TEST_PUBLIC_ID}</code> from cloud{" "}
                <code>{status.cloudName}</code>.
              </p>
              <p className="mt-2">
                If the image is broken, upload a sample in the{" "}
                <a
                  href="https://console.cloudinary.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline"
                >
                  Cloudinary Console
                </a>{" "}
                or use <strong>Upload to Cloudinary</strong> below.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
