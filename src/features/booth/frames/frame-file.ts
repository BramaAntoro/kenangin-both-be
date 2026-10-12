import { mkdirSync } from "node:fs";
import { unlink } from "node:fs/promises";
import { basename, join } from "node:path";

/** Direktori penyimpanan file PNG frame. */
export const uploadDirectory = join(process.cwd(), "uploads", "frames");
mkdirSync(uploadDirectory, { recursive: true });

/**
 * Membuat URL publik untuk file frame yang berada di direktori upload.
 *
 * @param filename - Nama file frame tanpa path direktori.
 * @returns URL publik file frame.
 */
export function getFrameUrl(filename: string): string {
  return `/uploads/frames/${filename}`;
}

/**
 * Menghapus file frame lama dari direktori upload jika file tersebut lokal.
 *
 * URL eksternal dan nama file dengan path tidak dihapus.
 *
 * @param frameUrl - URL frame lama.
 * @returns Promise yang selesai setelah proses penghapusan.
 */
export async function removeFrameFile(frameUrl: string): Promise<void> {
  const filename = frameUrl.startsWith("/uploads/frames/")
    ? frameUrl.slice("/uploads/frames/".length)
    : "";

  if (!filename || basename(filename) !== filename) return;

  await unlink(join(uploadDirectory, filename)).catch(() => undefined);
}

