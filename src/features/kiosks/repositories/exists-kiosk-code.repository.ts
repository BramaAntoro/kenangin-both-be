import { and, eq, ne } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { kiosks } from "../../../db/schema.js";

/**
 * Mengecek apakah kode kiosk sudah digunakan.
 *
 * @param kioskCode - Kode kiosk yang akan diperiksa.
 * @param excludeKioskId - ID kiosk opsional yang diabaikan dari pemeriksaan.
 * @returns `true` jika kode kiosk sudah digunakan.
 */
export default async function existsKioskCodeRepository(
  kioskCode: string,
  excludeKioskId?: string,
): Promise<boolean> {
  const [result] = await db
    .select({ id: kiosks.id })
    .from(kiosks)
    .where(
      excludeKioskId
        ? and(eq(kiosks.kioskCode, kioskCode), ne(kiosks.id, excludeKioskId))
        : eq(kiosks.kioskCode, kioskCode),
    );

  return Boolean(result);
}
