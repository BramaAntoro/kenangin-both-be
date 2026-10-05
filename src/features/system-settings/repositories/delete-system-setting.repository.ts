import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { systemSettings } from "../../../db/schema.js";
import type { DeleteSystemSettingResult } from "../types/delete-system-setting-result.js";

/**
 * Menghapus system setting berdasarkan ID.
 *
 * @param id - ID system setting yang akan dihapus.
 * @returns ID system setting yang dihapus atau `undefined` jika tidak ditemukan.
 */
export default async function deleteSystemSettingRepository(
  id: string,
): Promise<DeleteSystemSettingResult | undefined> {
  const [result] = await db
    .delete(systemSettings)
    .where(eq(systemSettings.id, id))
    .returning({ settingKey: systemSettings.settingKey });

  return result;
}
