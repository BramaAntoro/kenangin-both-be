import AppError from "../../../lib/app-error.js";
import deleteSystemSettingRepository from "../repositories/delete-system-setting.repository.js";
import type { DeleteSystemSettingResult } from "../types/delete-system-setting-result.js";

/**
 * Menghapus system setting berdasarkan ID.
 *
 * @param id - ID system setting yang akan dihapus.
 * @returns ID system setting yang berhasil dihapus.
 * @throws {AppError} Jika system setting tidak ditemukan.
 */
export default async function deleteSystemSettingService(
  id: string,
): Promise<DeleteSystemSettingResult> {
  const result = await deleteSystemSettingRepository(id);

  if (!result) {
    throw new AppError("System setting tidak ada", 404);
  }

  return result;
}
