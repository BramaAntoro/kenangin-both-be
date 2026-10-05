import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { systemSettings } from "../../../db/schema.js";
import type { SystemSettingResult } from "../types/system-setting-service-result.js";

/**
 * Memperbarui system setting berdasarkan ID.
 *
 * @param data - Data system setting yang akan diperbarui.
 * @returns System setting yang diperbarui atau `undefined` jika tidak ditemukan.
 */
export default async function updateSystemSettingRepository(data: {
  id: string;
  settingKey: string;
  settingValue: string;
  description: string | null;
  updatedBy: string;
}): Promise<SystemSettingResult> {
  const [result] = await db
    .update(systemSettings)
    .set({
      settingKey: data.settingKey,
      settingValue: data.settingValue,
      description: data.description,
      updatedBy: data.updatedBy,
      updatedAt: new Date(),
    })
    .where(eq(systemSettings.id, data.id))
    .returning();

  return result;
}
