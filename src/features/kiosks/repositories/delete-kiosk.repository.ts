import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { kiosks } from "../../../db/schema.js";
import type { KioskResult } from "../types/kiosk-result.js";

/**
 * Menghapus kiosk dari database berdasarkan ID.
 *
 * @param id - ID kiosk yang akan dihapus.
 * @returns Data kiosk yang telah dihapus atau `undefined` jika kiosk tidak ditemukan.
 */
export default async function deleteKioskRepository(
  id: string,
): Promise<KioskResult | undefined> {
  const [deletedKiosk] = await db
    .delete(kiosks)
    .where(eq(kiosks.id, id))
    .returning();

  return deletedKiosk;
}

