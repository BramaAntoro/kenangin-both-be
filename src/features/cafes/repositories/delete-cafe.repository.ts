import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafeUsers, cafes } from "../../../db/schema.js";
import type { DeleteCafeResult } from "../types/delete-cafe-result.js";

/**
 * Menghapus cafe dan relasinya dengan admin cafe berdasarkan ID dalam satu transaksi.
 *
 * @param id - ID cafe yang akan dihapus.
 * @returns Data cafe yang dihapus atau `undefined` jika tidak ditemukan.
 */
export default async function deleteCafeRepository(
  id: string,
): Promise<DeleteCafeResult | undefined> {
  return db.transaction(async (transaction) => {
    await transaction.delete(cafeUsers).where(eq(cafeUsers.cafeId, id));

    const [deletedCafe] = await transaction
      .delete(cafes)
      .where(eq(cafes.id, id))
      .returning({
        id: cafes.id,
        name: cafes.name,
        slug: cafes.slug,
      });

    return deletedCafe;
  });
}
