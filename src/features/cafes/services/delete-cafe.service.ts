import AppError from "../../../lib/app-error.js";
import deleteCafeRepository from "../repositories/delete-cafe.repository.js";
import type { DeleteCafeResult } from "../types/delete-cafe-result.js";

/**
 * Menghapus cafe berdasarkan ID.
 *
 * @param id - ID cafe yang akan dihapus.
 * @returns Data cafe yang berhasil dihapus.
 * @throws {AppError} Jika cafe tidak ditemukan.
 */
export default async function deleteCafeService(
  id: string,
): Promise<DeleteCafeResult> {
  const result = await deleteCafeRepository(id);

  if (!result) {
    throw new AppError("Cafe tidak ditemukan", 404);
  }

  return result;
}
