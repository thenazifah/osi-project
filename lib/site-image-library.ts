import { readdir } from "fs/promises";
import { extname, join } from "path";
import { listBlobSiteImages } from "@/lib/site-image-blob";

const IMAGE_DIRS = ["export", "products", "site"] as const;
const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

export type SiteImageOption = {
  url: string;
  label: string;
};

async function listLocalSiteImages(): Promise<SiteImageOption[]> {
  const root = join(process.cwd(), "public", "images");
  const results: SiteImageOption[] = [];

  for (const dir of IMAGE_DIRS) {
    const dirPath = join(root, dir);
    try {
      const files = await readdir(dirPath);
      for (const file of files) {
        if (!IMAGE_EXT.has(extname(file).toLowerCase())) continue;
        results.push({
          url: `/images/${dir}/${file}`,
          label: `${dir}/${file}`,
        });
      }
    } catch {
      // Directory may not exist yet.
    }
  }

  return results;
}

export async function listSiteImageLibrary(): Promise<SiteImageOption[]> {
  const [local, blob] = await Promise.all([
    listLocalSiteImages(),
    listBlobSiteImages(),
  ]);

  const seen = new Set<string>();
  const merged: SiteImageOption[] = [];

  for (const item of [...blob, ...local]) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    merged.push(item);
  }

  return merged.sort((a, b) => a.label.localeCompare(b.label));
}
