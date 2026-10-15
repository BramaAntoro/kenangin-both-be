import { and, asc, desc, eq, exists, sql } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { boothPackages, cafeUsers, cafes } from "../../../../db/schema.js";

/**
 * Membuat query untuk mengambil cafe beserta paket booth-nya.
 *
 * Jika `userId` tersedia, query dibatasi pada cafe yang dikelola user tersebut
 * melalui subquery `EXISTS`. Cara ini mencegah paket terduplikasi ketika satu
 * cafe memiliki lebih dari satu admin. Jika `userId` tidak tersedia, seluruh
 * cafe diikutkan dalam hasil query.
 *
 * Hasil query memiliki satu row per paket. Cafe tanpa paket tetap menghasilkan
 * row dengan `boothPackage` bernilai `null` karena menggunakan `LEFT JOIN`.
 * Pengelompokan row menjadi bentuk respons dilakukan oleh service.
 *
 * @param userId - ID user cafe admin untuk membatasi cakupan cafe; kosong untuk
 *   mengambil seluruh cafe.
 * @returns Promise query result berisi `cafeId`, `cafeName`, dan paket booth.
 */
export default function readBoothPackagesRepository(
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
    .leftJoin(boothPackages, eq(boothPackages.cafeId, cafes.id))
    .where(belongsToCurrentUser)
    .orderBy(
      asc(cafes.name),
      asc(boothPackages.price),
      desc(boothPackages.createdAt),
    );
}
