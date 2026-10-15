import readSystemSettingsRepository from "../repositories/read-system-settings.repository.js";
import type { ReadSystemSettingResult } from "../types/read-system-settings-result.js";

/**
 * Membaca seluruh system setting yang tersedia.
 *
 * @returns Daftar system setting tanpa informasi `updatedBy`.
 */
export default async function readSystemSettingsService(): Promise<
  ReadSystemSettingResult[]
> {
  return readSystemSettingsRepository();
}
