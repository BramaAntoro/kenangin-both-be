import AppError from "../../../../lib/app-error.js";
import findCafeIdByUserIdRepository from "../../repositories/find-cafe-id-by-user-id.repository.js";
import type { UpdateBoothPackageDto } from "../dto/update-booth-package.dto.js";
import findMinPackagePriceRepository from "../repositories/find-min-package-price.repository.js";
import updateBoothPackageRepository from "../repositories/update-booth-package.repository.js";
import type { BoothPackageResult } from "../types/booth-package-result.js";

/**
 * Memperbarui paket booth milik cafe dari admin yang sedang login.
 *
 * Harga divalidasi terhadap setting harga minimum sebelum data disimpan.
 * Kepemilikan paket divalidasi oleh repository saat query pembaruan dijalankan.
 *
 * @param packageId - ID paket booth yang akan diperbarui.
 * @param userId - ID cafe admin dari JWT.
 * @param payload - Data paket yang telah tervalidasi.
 * @returns Paket booth setelah diperbarui.
 * @throws {AppError} Jika harga tidak valid, paket tidak ada, atau admin tidak
 * memiliki akses ke paket tersebut.
 */
export default async function updateBoothPackageService(
  packageId: string,
  userId: string,
  payload: UpdateBoothPackageDto,
): Promise<BoothPackageResult> {
  if (payload.cafeId) {
    const cafe = await findCafeIdByUserIdRepository(userId, payload.cafeId);
    if (!cafe) {
      throw new AppError("Anda tidak memiliki akses ke cafe ini", 403);
    }
  }

  await findMinPackagePriceRepository(payload.price);

  const result = await updateBoothPackageRepository(packageId, userId, payload);
  if (!result) {
    throw new AppError("Paket tidak ditemukan", 404);
  }

  return result;
}
