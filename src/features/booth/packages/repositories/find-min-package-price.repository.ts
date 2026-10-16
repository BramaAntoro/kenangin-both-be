import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { systemSettings } from "../../../../db/schema.js";
import AppError from "../../../../lib/app-error.js";

/**
 * Mengambil nilai `min_package_price` dari tabel `system_settings` dan
 * memastikan harga paket memenuhi batas minimum yang dikonfigurasi.
 *
 * @param price - Harga paket yang akan divalidasi.
 * @throws {AppError} 404 jika pengaturan batas minimal harga tidak ditemukan.
 * @throws {AppError} 400 jika nilai pengaturan tidak valid (NaN) atau harga berada di bawah batas minimum.
 */
export default async function findMinPackagePriceRepository(
  price: number,
): Promise<void> {
  const [result] = await db
    .select({ settingValue: systemSettings.settingValue })
    .from(systemSettings)
    .where(eq(systemSettings.settingKey, "min_package_price"));

  if (!result) {
    throw new AppError("Pengaturan batas minimal harga paket tidak ditemukan", 404);
  }

  const minPrice = Number(result.settingValue);
  if (result.settingValue?.trim() === "" || Number.isNaN(minPrice)) {
    throw new AppError("Nilai batas minimal harga paket tidak valid", 400);
  }

  if (price < minPrice) {
    throw new AppError(`Harga paket di bawah batas minimal (Rp${minPrice})`, 400);
  }
}

