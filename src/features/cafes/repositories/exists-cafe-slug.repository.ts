import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafes } from "../../../db/schema.js";

/**
 * Mengecek apakah slug cafe sudah digunakan.
 *
 * @param slug - Slug cafe yang akan diperiksa.
 * @returns `true` jika slug sudah digunakan.
 */
export default async function existsCafeSlugRepository(
  slug: string,
): Promise<boolean> {
  const [result] = await db
    .select({ id: cafes.id })
    .from(cafes)
    .where(eq(cafes.slug, slug));

  return Boolean(result);
}
