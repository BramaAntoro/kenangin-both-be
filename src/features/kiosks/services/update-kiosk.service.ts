import AppError from "../../../lib/app-error.js";
import type { UpdateKioskDto } from "../dto/update-kiosk.dto.js";
import findCafeByIdRepository from "../repositories/find-cafe-by-id.repository.js";
import updateKioskRepository from "../repositories/update-kiosk.repository.js";
import type { KioskResult } from "../types/kiosk-result.js";

/**
 * Memperbarui data kiosk berdasarkan ID.
 *
 * @param id - ID kiosk yang akan diperbarui.
 * @param payload - Data perubahan kiosk yang sudah divalidasi.
 * @returns Data kiosk yang berhasil diperbarui.
 * @throws {AppError} Jika cafeId baru tidak ditemukan atau kiosk tidak ditemukan.
 */
export default async function updateKioskService(
  id: string,
  payload: UpdateKioskDto,
): Promise<KioskResult> {
  if (payload.cafeId) {
    const cafeExists = await findCafeByIdRepository(payload.cafeId);
    if (!cafeExists) {
      throw new AppError("Cafe tidak ditemukan", 404);
    }
  }

  const result = await updateKioskRepository(id, payload);

  if (!result) {
    throw new AppError("Kiosk tidak ditemukan", 404);
  }

  return result;
}
