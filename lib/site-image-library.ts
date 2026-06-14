import { readdir } from "fs/promises";
import { extname, join } from "path";
import { listFirebaseSiteImages } from "@/lib/site-image-storage";

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
  const [local, cloud] = await Promise.all([
    listLocalSiteImages(),
    listFirebaseSiteImages(),
  ]);

  const seen = new Set<string>();
  const merged: SiteImageOption[] = [];

  for (const item of [...cloud, ...local]) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    merged.push(item);
  }

  return merged.sort((a, b) => a.label.localeCompare(b.label));
}
