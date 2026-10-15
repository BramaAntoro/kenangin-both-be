import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { cafes } from "../../../../db/schema.js";

/**
 * Mengambil persentase pembagian pendapatan cafe.
 *
 * @param cafeId - ID cafe yang akan dicari.
 * @returns Persentase bagian cafe dan Kenangin, atau `undefined` jika cafe
 * tidak ditemukan.
 */
export default async function readCafeRevenueShareRepository(cafeId: string) {
  const [cafe] = await db
    .select({
      cafeSharePercent: cafes.cafeSharePercent,
      kenanginSharePercent: cafes.kenanginSharePercent,
    })
    .from(cafes)
    .where(eq(cafes.id, cafeId))
    .limit(1);

  return cafe;
}
