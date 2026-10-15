import { count, eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { kiosks } from "../../../db/schema.js";

/**
 * Menghitung jumlah kiosk yang terhubung dengan cafe tertentu.
 *
 * @param cafeId - ID cafe yang akan dihitung kiosknya.
 * @returns Jumlah kiosk milik cafe.
 */

export default async function countKiosksByCafeIdRepository(
  cafeId: string,
): Promise<number> {
  const [result] = await db
    .select({ total: count() })
    .from(kiosks)
    .where(eq(kiosks.cafeId, cafeId));

  return result?.total ?? 0;
}
