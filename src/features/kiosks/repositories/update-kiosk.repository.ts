import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { kiosks } from "../../../db/schema.js";
import type { UpdateKioskDto } from "../dto/update-kiosk.dto.js";
import type { KioskResult } from "../types/kiosk-result.js";

/**
 * Memperbarui data kiosk di database berdasarkan ID.
 *
 * @param id - ID kiosk yang akan diperbarui.
 * @param data - Data field kiosk yang akan diperbarui.
 * @returns Data kiosk yang telah diperbarui atau `undefined` jika kiosk tidak ditemukan.
 */
export default async function updateKioskRepository(
  id: string,
  data: UpdateKioskDto,
): Promise<KioskResult | undefined> {
  const [updatedKiosk] = await db
    .update(kiosks)
    .set({
      cafeId: data.cafeId,
      name: data.name,
      status: data.status,
      updatedAt: new Date(),
    })
    .where(eq(kiosks.id, id))
    .returning();

  return updatedKiosk;
}
