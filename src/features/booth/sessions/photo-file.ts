import { mkdirSync } from "node:fs";
import { join } from "node:path";

/** Direktori penyimpanan foto sesi yang disajikan sebagai file statis. */
export const photoDirectory = join(process.cwd(), "uploads", "photos");
mkdirSync(photoDirectory, { recursive: true });

/**
 * Membuat URL publik untuk foto sesi.
 *
 * @param filename - Nama file foto yang disimpan.
 * @returns Path URL publik foto.
 */
export function getPhotoUrl(filename: string): string {
  return `/uploads/photos/${filename}`;
}
