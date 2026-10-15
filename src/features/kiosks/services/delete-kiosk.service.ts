import AppError from "../../../lib/app-error.js";
import deleteKioskRepository from "../repositories/delete-kiosk.repository.js";
import type { KioskResult } from "../types/kiosk-result.js";

/**
 * Menghapus kiosk berdasarkan ID.
 *
 * @param id - ID kiosk yang akan dihapus.
 * @returns Data kiosk yang berhasil dihapus.
 * @throws {AppError} Jika kiosk tidak ditemukan.
 */
export default async function deleteKioskService(
  id: string,
): Promise<KioskResult> {
  const result = await deleteKioskRepository(id);

  if (!result) {
    throw new AppError("Kiosk tidak ditemukan", 404);
  }

  return result;
}

