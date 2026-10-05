import { db } from "../../../db/index.js";
import { systemSettings } from "../../../db/schema.js";
import type { SystemSettingResult } from "../types/system-setting-service-result.js";

/**
 * Membuat system setting baru.
 *
 * @param data - Data system setting yang akan disimpan.
 * @returns System setting yang berhasil dibuat.
 */
export default async function createSystemSettingRepository(data: {
  settingKey: string;
  settingValue: string;
  description: string | null;
  updatedBy: string;
}): Promise<SystemSettingResult> {
  const [result] = await db
    .insert(systemSettings)
    .values({
      settingKey: data.settingKey,
      settingValue: data.settingValue,
      description: data.description ?? null,
      updatedBy: data.updatedBy,
    })
    .returning();

  return result;
}
