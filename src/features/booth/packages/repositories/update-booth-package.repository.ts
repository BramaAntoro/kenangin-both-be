import { and, eq, exists, sql } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { boothPackages, cafeUsers } from "../../../../db/schema.js";
import type { UpdateBoothPackageDto } from "../dto/update-booth-package.dto.js";
import type { BoothPackageResult } from "../types/booth-package-result.js";

/**
 * Memperbarui paket booth jika paket tersebut milik cafe yang dikelola user.
 *
 * Subquery `EXISTS` mencocokkan `booth_packages.cafe_id` dengan relasi
 * `cafe_users`, sehingga admin tidak dapat memperbarui paket cafe lain.
 *
 * @param packageId - ID paket booth yang akan diperbarui.
 * @param userId - ID cafe admin yang harus memiliki relasi ke cafe pemilik paket.
 * @param data - Properti paket yang akan diperbarui.
 * @returns Paket yang telah diperbarui, atau `undefined` jika tidak ditemukan
 * atau user tidak memiliki akses.
 */
export default async function updateBoothPackageRepository(
  packageId: string,
  userId: string,
  data: UpdateBoothPackageDto,
): Promise<BoothPackageResult | undefined> {
  const [result] = await db
    .update(boothPackages)
    .set({ ...data, updatedAt: new Date() })
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
