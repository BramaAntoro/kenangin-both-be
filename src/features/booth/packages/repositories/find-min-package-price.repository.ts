import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { systemSettings } from "../../../../db/schema.js";

/**
 * Mengambil nilai `min_package_price` dari tabel `system_settings`.
 *
 * @returns Object berisi `settingValue` atau `undefined` jika setting belum dikonfigurasi.
 */
export default async function findMinPackagePriceRepository(): Promise<
  { settingValue: string } | undefined
> {
  const [result] = await db
    .select({ settingValue: systemSettings.settingValue })
    .from(systemSettings)
    .where(eq(systemSettings.settingKey, "min_package_price"));

  return result;
}

