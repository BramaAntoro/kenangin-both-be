import AppError from "../../../lib/app-error.js";
import type { UpdateSystemSettingDto } from "../dto/update-system-setting.dto.js";
import findSystemSettingRepository from "../repositories/find-system-setting.repository.js";
import updateSystemSettingRepository from "../repositories/update-system-setting.repository.js";
import type { SystemSettingResult } from "../types/system-setting-service-result.js";

/**
 * Memperbarui system setting berdasarkan ID.
 *
 * @param id - ID system setting yang akan diperbarui.
 * @param payload - Data perubahan system setting.
 * @param updatedBy - ID super admin yang melakukan perubahan.
 * @returns System setting yang telah diperbarui.
 * @throws {AppError} Jika system setting tidak ditemukan.
 */
export default async function updateSystemSettingService(
  id: string,
  payload: UpdateSystemSettingDto,
  updatedBy: string,
): Promise<SystemSettingResult> {
  const { settingKey, settingValue, description } = payload;

  const existingSetting = await findSystemSettingRepository(settingKey);

  if (existingSetting && existingSetting.id !== id) {
    throw new AppError("Setting key sudah digunakan", 409);
  }

  const result = await updateSystemSettingRepository({
    id,
    settingKey,
    settingValue,
    description,
    updatedBy,
  });

  if (!result) {
    throw new AppError("System setting tidak ada", 404);
  }

  return result;
}
