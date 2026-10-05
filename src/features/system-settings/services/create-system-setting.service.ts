import AppError from "../../../lib/app-error.js";
import type { CreateSystemSettingDto } from "../dto/create-system-setting.dto.js";
import createSystemSettingRepository from "../repositories/create-system-setting.repository.js";
import findSystemSettingRepository from "../repositories/find-system-setting.repository.js";
import type { SystemSettingResult } from "../types/system-setting-service-result.js";

/**
 * Membuat system setting baru yang bersifat global.
 *
 * @param payload - Data setting yang sudah divalidasi.
 * @param updatedBy - ID super admin yang membuat setting.
 * @returns System setting yang berhasil dibuat.
 * @throws {AppError} Jika setting key sudah digunakan.
 */
export default async function createSystemSettingService(
  payload: CreateSystemSettingDto,
  updatedBy: string,
): Promise<SystemSettingResult> {
  const { settingKey, settingValue, description } = payload;
  const existingSetting = await findSystemSettingRepository(settingKey);

  if (existingSetting) {
    throw new AppError("Setting key sudah digunakan", 409);
  }

  const result = await createSystemSettingRepository({
    settingKey,
    settingValue,
    description: description ?? null,
    updatedBy,
  });

  if (!result) {
    throw new Error("System setting gagal dibuat");
  }

  return result;
}
