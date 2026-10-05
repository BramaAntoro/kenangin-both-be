import { db } from "../../../db/index.js";
import { systemSettings } from "../../../db/schema.js";
import type { CreateSystemSettingServiceResult } from "../types/create-system-setting-service-result.js";

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
}): Promise<CreateSystemSettingServiceResult> {
  const [result] = await db
    .insert(systemSettings)
    .values({
      settingKey: data.settingKey,
      settingValue: data.settingValue,
      description: data.description ?? null,
      updatedBy: data.updatedBy,
    })
    .returning();

  if (!result) {
    throw new Error("System setting gagal dibuat");
  }

  return result;
}
