import AppError from "../../../../lib/app-error.js";
import deleteBoothPackageRepository from "../repositories/delete-booth-package.repository.js";
import type { BoothPackageResult } from "../types/booth-package-result.js";

/**
 * Menghapus permanen paket booth milik cafe admin yang sedang login.
 *
 * @param packageId - ID paket booth yang akan dinonaktifkan.
 * @param userId - ID cafe admin dari JWT.
 * @returns Paket booth yang telah dihapus.
 * @throws {AppError} Jika paket tidak ditemukan atau admin tidak memiliki akses.
 */
export default async function deleteBoothPackageService(
  packageId: string,
  userId: string,
): Promise<BoothPackageResult> {
  const result = await deleteBoothPackageRepository(packageId, userId);

  if (!result) {
    throw new AppError("Paket tidak ditemukan", 404);
  }

  return result;
}
