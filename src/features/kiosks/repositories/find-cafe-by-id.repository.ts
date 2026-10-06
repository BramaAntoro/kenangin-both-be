import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafes } from "../../../db/schema.js";

/**
 * Mengambil data cafe berdasarkan ID untuk kebutuhan fitur kiosk.
 *
 * @param cafeId - ID cafe yang dicari.
 * @returns Data cafe atau `undefined` jika tidak ditemukan.
 */
export default async function findCafeByIdRepository(cafeId: string) {
  const [cafe] = await db
    .select({
      id: cafes.id,
      name: cafes.name,
      slug: cafes.slug,
    })
    .from(cafes)
    .where(eq(cafes.id, cafeId));

  return cafe;
}
