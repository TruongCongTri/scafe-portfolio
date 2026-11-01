import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import { CATALOG_TAG, emptyCatalog, type Catalog } from "./catalog";

// One JSON file and an uploads folder. Swap this module for a database on hosts
// without a persistent disk: nothing else touches the storage directly.
const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const CATALOG_FILE = path.join(DATA_DIR, "catalog.json");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

export async function readCatalog(): Promise<Catalog> {
  try {
    return { ...emptyCatalog, ...JSON.parse(await readFile(CATALOG_FILE, "utf8")) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyCatalog;
    throw error;
  }
}

// What the public pages read. A publish expires it through CATALOG_TAG.
export async function getCatalog() {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("max");
  return readCatalog();
}

let queue: Promise<unknown> = Promise.resolve();

// Writes run one at a time, and the rename means a failure can't leave half a file.
export function changeCatalog(change: (catalog: Catalog) => Catalog) {
  const run = queue.then(async () => {
    const next = change(await readCatalog());
    await mkdir(DATA_DIR, { recursive: true });
    const temporary = `${CATALOG_FILE}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(next, null, 2));
    await rename(temporary, CATALOG_FILE);
    return next;
  });
  queue = run.catch(() => {});
  return run;
}

export async function saveUpload(data: Buffer) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}.webp`;
  await writeFile(path.join(UPLOAD_DIR, name), data);
  return `/media/${name}`;
}

export async function removeUpload(url?: string) {
  if (!url?.startsWith("/media/")) return;
  await rm(path.join(UPLOAD_DIR, path.basename(url)), { force: true });
}
