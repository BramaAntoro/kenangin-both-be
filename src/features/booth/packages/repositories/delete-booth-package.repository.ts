import { and, eq, exists, sql } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import {
  boothPackages,
  boothTransactions,
  cafeUsers,
} from "../../../../db/schema.js";
import type { BoothPackageResult } from "../types/booth-package-result.js";

export type DeleteBoothPackageResult =
  | { status: "not_found" }
  | { status: "has_transactions"; packageName: string }
  | { status: "deleted"; boothPackage: BoothPackageResult };

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
): Promise<DeleteBoothPackageResult> {
  return db.transaction(async (transaction) => {
    const [existingPackage] = await transaction
      .select({ id: boothPackages.id, name: boothPackages.name })
      .from(boothPackages)
      .where(
        and(
          eq(boothPackages.id, packageId),
          exists(
            transaction
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
      .for("update");

    if (!existingPackage) {
      return { status: "not_found" };
    }

    const [existingTransaction] = await transaction
      .select({ id: boothTransactions.id })
      .from(boothTransactions)
      .where(eq(boothTransactions.packageId, packageId))
      .limit(1);

    if (existingTransaction) {
      return {
        status: "has_transactions",
        packageName: existingPackage.name,
      };
    }

    const [deletedPackage] = await transaction
      .delete(boothPackages)
      .where(eq(boothPackages.id, packageId))
      .returning();

    if (!deletedPackage) {
      return { status: "not_found" };
    }

    return {
      status: "deleted",
      boothPackage: deletedPackage,
    };
  });
}
