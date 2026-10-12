import { mkdirSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { basename, join } from "node:path";

/** Direktori penyimpanan file PNG frame. */
export const uploadDirectory = join(process.cwd(), "uploads", "frames");
mkdirSync(uploadDirectory, { recursive: true });

/** Membuat URL publik untuk file frame yang berada di direktori upload. */
export function getFrameUrl(filename: string): string {
  return `/uploads/frames/${filename}`;
}

/** Menghapus file frame lama dari direktori upload jika file tersebut lokal. */
export async function removeFrameFile(frameUrl: string): Promise<void> {
  const filename = frameUrl.startsWith("/uploads/frames/")
    ? frameUrl.slice("/uploads/frames/".length)
    : "";

  if (!filename || basename(filename) !== filename) return;

  await unlink(join(uploadDirectory, filename)).catch(() => undefined);
}

