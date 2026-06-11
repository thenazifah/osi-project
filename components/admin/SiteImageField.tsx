"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImageIcon, Images, Loader2, Upload, X } from "lucide-react";
import {
  listAvailableSiteImages,
  uploadAdminSiteImage,
} from "@/lib/admin-actions";
import type { SiteImageOption } from "@/lib/site-image-library";
import { CldMediaImage } from "@/components/visuals/CldMediaImage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type SiteImageFieldProps = {
  id: string;
  label: string;
  hint?: string;
  imageKey: string;
  value: string;
  onChange: (value: string) => void;
};

export function SiteImageField({
  id,
  label,
  hint,
  imageKey,
  value,
  onChange,
}: SiteImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [library, setLibrary] = useState<SiteImageOption[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);

  const uploadFile = (file: File | null | undefined) => {
    if (!file || isPending) return;
    setError(null);
    setPickerOpen(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageKey", imageKey);

    startTransition(async () => {
      const result = await uploadAdminSiteImage(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.url) {
        onChange(result.url);
      }
    });
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isPending) return;
    uploadFile(event.dataTransfer.files?.[0]);
  };

  const openPicker = () => {
    setError(null);
    setPickerOpen(true);
    setLoadingLibrary(true);
    void listAvailableSiteImages()
      .then((images) => setLibrary(images))
      .catch(() => setError("Could not load existing images."))
      .finally(() => setLoadingLibrary(false));
  };

  const selectExisting = (url: string) => {
    onChange(url);
    setPickerOpen(false);
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
          !isPending && "hover:border-accent-2/40"
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
            <p className="font-sans text-xs">Drop an image here or click Upload</p>
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
        disabled={isPending}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="default"
          size="sm"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isPending ? "Uploading…" : "Upload image"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={openPicker}
        >
          <Images className="h-4 w-4" />
          Choose existing
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

      {pickerOpen ? (
        <div className="space-y-2 rounded-lg border border-border bg-surface p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-sans text-xs font-medium text-ink">
              Choose from existing images
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPickerOpen(false)}
            >
              Close
            </Button>
          </div>

          {loadingLibrary ? (
            <div className="flex items-center justify-center py-8 text-ink-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : library.length === 0 ? (
            <p className="py-4 text-center font-sans text-xs text-ink-muted">
              No images found in public/images yet.
            </p>
          ) : (
            <div className="grid max-h-52 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
              {library.map((image) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => selectExisting(image.url)}
                  className={cn(
                    "group relative aspect-video overflow-hidden rounded-md border border-border bg-tag-bg transition-colors hover:border-accent-2/50",
                    value === image.url && "ring-2 ring-accent"
                  )}
                  title={image.label}
                >
                  <Image
                    src={image.url}
                    alt={image.label}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 font-sans text-xs text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
