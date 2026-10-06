import { db } from "../../../db/index.js";
import { kiosks } from "../../../db/schema.js";
import type { KioskResult } from "../types/kiosk-result.js";

/**
 * Data yang dibutuhkan repository untuk membuat kiosk baru.
 */
type CreateKioskRepositoryData = {
  cafeId: string;
  kioskCode: string;
  name: string;
  status?: "active" | "maintenance" | "offline" | undefined;
};

/**
 * Menyimpan data kiosk baru ke database.
 *
 * @param data - Data kiosk yang akan disimpan.
 * @returns Data kiosk yang berhasil dibuat.
 */
export default async function createKioskRepository(
  data: CreateKioskRepositoryData,
): Promise<KioskResult | undefined> {
  const [result] = await db
    .insert(kiosks)
    .values({
      cafeId: data.cafeId,
      kioskCode: data.kioskCode,
      name: data.name,
      status: data.status,
    })
    .returning();

  return result;
}
