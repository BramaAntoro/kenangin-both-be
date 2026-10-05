import { db } from "../../../db/index.js";
import { systemSettings } from "../../../db/schema.js";
import type { ReadSystemSettingResult } from "../types/read-system-settings-result.js";

/**
 * Mengambil seluruh system setting tanpa mengambil data user atau melakukan
 * join ke tabel users.
 *
 * @returns Daftar system setting yang hanya berisi id, key, dan value.
 */
export default async function readSystemSettingsRepository(): Promise<
  ReadSystemSettingResult[]
> {
  return db
    .select({
      id: systemSettings.id,
      settingKey: systemSettings.settingKey,
      settingValue: systemSettings.settingValue,
    })
    .from(systemSettings);
}
