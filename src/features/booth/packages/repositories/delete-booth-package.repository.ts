import { and, eq, exists, sql } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { boothPackages, cafeUsers } from "../../../../db/schema.js";
import type { BoothPackageResult } from "../types/booth-package-result.js";

/**
 * Menghapus permanen paket milik cafe yang dikelola oleh user.
 *
 * @param packageId - ID paket booth yang akan dihapus.
 * @param userId - ID cafe admin pemilik akses ke cafe paket.
 * @returns Paket yang telah dihapus atau `undefined` jika tidak ditemukan
 * atau user tidak memiliki akses.
 */
export default async function deleteBoothPackageRepository(
  packageId: string,
  userId: string,
): Promise<BoothPackageResult | undefined> {
  const [result] = await db
    .delete(boothPackages)
    .where(
      and(
        eq(boothPackages.id, packageId),
        exists(
          db
            .select({ value: sql`1` })
            .from(cafeUsers)
            .where(
              and(
                eq(cafeUsers.cafeId, boothPackages.cafeId),
                eq(cafeUsers.userId, userId),
              ),
            ),
        ),
      ),
    )
    .returning();

  return result as BoothPackageResult | undefined;
}
