import { and, asc, desc, eq, exists, sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { boothPackages, cafeUsers, cafes } from "../../../db/schema.js";

/**
 * Mengambil satu cafe beserta paket booth-nya.
 *
 * Jika `userId` diberikan, hasil hanya mencakup cafe yang terhubung ke user.
 * Cafe tanpa paket tetap muncul dengan `boothPackage` bernilai `null`.
 *
 * @param cafeId - ID cafe yang dicari.
 * @param userId - ID cafe admin untuk membatasi akses; kosong untuk super admin.
 * @returns Row cafe dan paketnya, atau array kosong jika cafe tidak ada atau tidak terakses.
 */
export default function readBoothPackagesByCafeRepository(
  cafeId: string,
  userId?: string,
) {
  const belongsToCurrentUser = userId
    ? exists(
        db
          .select({ value: sql`1` })
          .from(cafeUsers)
          .where(
            and(
              eq(cafeUsers.cafeId, cafes.id),
              eq(cafeUsers.userId, userId),
            ),
          ),
      )
    : undefined;

  return db
    .select({
      cafeId: cafes.id,
      cafeName: cafes.name,
      boothPackage: boothPackages,
    })
    .from(cafes)
    .leftJoin(
      boothPackages,
      and(
        eq(boothPackages.cafeId, cafes.id),
        eq(boothPackages.isActive, true),
      ),
    )
    .where(and(eq(cafes.id, cafeId), belongsToCurrentUser))
    .orderBy(asc(boothPackages.price), desc(boothPackages.createdAt));
}
