import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { systemSettings } from "../../../../db/schema.js";
import AppError from "../../../../lib/app-error.js";

/**
 * Mengambil nilai `min_package_price` dari tabel `system_settings` dan
 * memastikan harga paket memenuhi batas minimum yang dikonfigurasi.
 *
 * Setting yang tidak ada atau nilainya bukan angka akan dilewati.
 *
 * @param price - Harga paket yang akan divalidasi.
 * @throws {AppError} Jika harga berada di bawah batas minimum.
 */
export default async function findMinPackagePriceRepository(
  price: number,
): Promise<void> {
  const [result] = await db
    .select({ settingValue: systemSettings.settingValue })
    .from(systemSettings)
    .where(eq(systemSettings.settingKey, "min_package_price"));

  if (!result) return;

  const minPrice = Number(result.settingValue);
  if (!Number.isNaN(minPrice) && price < minPrice) {
    throw new AppError(`Harga paket di bawah batas minimal (Rp${minPrice})`, 400);
  }
}
