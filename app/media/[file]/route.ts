import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/catalogStore";

// Serves uploaded photos, whose random names never change.
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[0-9a-f-]{36}\.webp$/.test(file)) return new Response(null, { status: 404 });
  try {
    return new Response(await readFile(path.join(UPLOAD_DIR, file)), {
      headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
