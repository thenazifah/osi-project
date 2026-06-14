import { get } from "@vercel/blob";
import { getBlobConfig } from "@/lib/site-image-blob";

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const pathname = path.map(decodeURIComponent).join("/");
  const { token } = getBlobConfig();

  if (!token) {
    return new Response("Blob storage not configured", { status: 503 });
  }

  try {
    const result = await get(pathname, {
      access: "private",
      token,
    });

    if (!result) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set(
      "Content-Type",
      result.blob.contentType || "application/octet-stream"
    );
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(result.stream, { headers });
  } catch {
    return new Response("Failed to load image", { status: 500 });
  }
}
