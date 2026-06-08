"use client";

import { useRef, useState, useTransition } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { uploadAdminImageToCloudinary } from "@/lib/admin-actions";
import { CldMediaImage } from "@/components/visuals/CldMediaImage";
import { cloudinaryDirectUploadReady } from "@/lib/cloudinary-upload-server";
import { siteImageFolder } from "@/lib/cloudinary-image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type CloudinaryImageFieldProps = {
  id: string;
  label: string;
  hint?: string;
  imageKey: string;
  value: string;
  onChange: (value: string) => void;
};

export function CloudinaryImageField({
  id,
  label,
  hint,
  imageKey,
  value,
  onChange,
}: CloudinaryImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const uploadStatus = cloudinaryDirectUploadReady();
  const folder = siteImageFolder(imageKey);

  const uploadFile = (file: File | null | undefined) => {
    if (!file) return;
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    startTransition(async () => {
      const result = await uploadAdminImageToCloudinary(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.publicId) {
        onChange(result.publicId);
      }
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!uploadStatus.ready || isPending) return;
    uploadFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-bg/50 p-4">
      <div>
        <Label htmlFor={id}>{label}</Label>
        {hint ? (
          <p className="mt-1 font-sans text-xs text-ink-muted">{hint}</p>
        ) : null}
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          "relative h-40 w-full overflow-hidden rounded-lg border-2 border-dashed border-border bg-tag-bg transition-colors",
          uploadStatus.ready && !isPending && "hover:border-accent-2/40"
        )}
      >
        {value.trim() ? (
          <CldMediaImage
            src={value}
            alt={label}
            fill
            sizes="320px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-ink-muted">
            <ImageIcon className="h-8 w-8 opacity-40" strokeWidth={1.5} />
            <p className="font-sans text-xs">
              {uploadStatus.ready
                ? "Drop an image here or click Upload"
                : "Configure Cloudinary in .env.local to enable upload"}
            </p>
          </div>
        )}
        {isPending ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        className="sr-only"
        onChange={onFileChange}
        disabled={!uploadStatus.ready || isPending}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={!uploadStatus.ready || isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isPending ? "Uploading…" : "Upload to Cloudinary"}
        </Button>
        {value.trim() ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        ) : null}
      </div>

      {value.trim() ? (
        <p className="rounded-lg bg-tag-bg px-3 py-2 font-mono text-[11px] text-ink-muted">
          Cloudinary ID: <span className="text-ink">{value}</span>
        </p>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-sans text-xs text-red-700">
          {error}
        </p>
      ) : null}

      {!uploadStatus.ready ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-sans text-xs text-amber-900">
          {uploadStatus.message}
        </p>
      ) : null}
    </div>
  );
}
