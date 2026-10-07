import AppError from "../../../../lib/app-error.js";
import type { CreateBoothPackageDto } from "../dto/create-booth-package.dto.js";
import createBoothPackageRepository from "../repositories/create-booth-package.repository.js";
import findCafeIdByUserIdRepository from "../repositories/find-cafe-id-by-user-id.repository.js";
import findMinPackagePriceRepository from "../repositories/find-min-package-price.repository.js";
import type { BoothPackageResult } from "../types/booth-package-result.js";

/**
 * Membuat paket booth baru untuk cafe admin yang sedang login.
 *
 * Alur:
 * 1. Ambil `cafe_id` dari relasi `cafe_users` berdasarkan `userId` JWT.
 * 2. Validasi harga minimum paket dari `system_settings`.
 * 3. Simpan paket ke database.
 *
 * @param userId - ID user dari JWT payload.
 * @param payload - Data paket yang sudah divalidasi Zod.
 * @returns Data paket booth yang berhasil dibuat.
 * @throws {AppError} 404 jika user tidak terhubung ke cafe manapun.
 * @throws {AppError} 400 jika harga di bawah batas minimal platform.
 * @throws {AppError} 500 jika penyimpanan gagal.
 */
export default async function createBoothPackageService(
  userId: string,
  payload: CreateBoothPackageDto,
): Promise<BoothPackageResult> {
  const {
    name,
    price,
    photoShotsCount,
    printCopiesCount,
    features,
    description,
  } = payload;

  const cafeUser = await findCafeIdByUserIdRepository(userId);
  if (!cafeUser) {
    throw new AppError("Akun Anda belum terhubung ke cafe manapun", 404);
  }

  const minPriceSetting = await findMinPackagePriceRepository();
  if (minPriceSetting) {
    const minPrice = Number(minPriceSetting.settingValue);
    if (!Number.isNaN(minPrice) && price < minPrice) {
      throw new AppError(
        `Harga paket di bawah batas minimal (Rp${minPrice}) `,
        400,
      );
    }
  }

  const result = await createBoothPackageRepository({
    cafeId: cafeUser.cafeId,
    name,
    price,
    photoShotsCount,
    printCopiesCount,
    features,
    description,
  });

  if (!result) {
    throw new AppError("Gagal membuat paket kenangin booth", 500);
  }

  return result;
}
