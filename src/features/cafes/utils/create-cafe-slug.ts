/**
 * Membuat slug URL-safe dari nama cafe.
 *
 * @param name - Nama cafe yang akan diubah menjadi slug.
 * @returns Slug cafe dalam format huruf kecil dengan pemisah tanda hubung.
 */
export default function createCafeSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
