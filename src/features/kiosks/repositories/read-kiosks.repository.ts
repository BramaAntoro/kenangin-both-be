import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafeUsers, cafes, kiosks } from "../../../db/schema.js";
import type { KioskResult } from "../types/kiosk-result.js";

export type ReadKiosksRow = {
  id: string;
  cafeName: string;
  kiosk: KioskResult | null;
};

export type ReadPaginatedKiosksParams = {
  page: number;
  limit: number;
  search?: string | undefined;
};

export type ReadPaginatedKiosksResult = {
  kiosks: (KioskResult & { cafeName: string })[];
  totalItems: number;
};

/**
 * Mengambil data baris cafe beserta data kiosk yang terhubung.
 *
 * - Jika `userId` diisi (role cafe_admin), hanya mengambil cafe yang terhubung dengan user tersebut.
 * - Jika `userId` kosong/undefined (role super_admin), mengambil seluruh cafe beserta kiosknya.
 *
 * @param userId - ID user opsional untuk membatasi ke cafe milik admin tertentu.
 * @returns Daftar baris berisi nama cafe dan data kiosk.
 */
export default async function readKiosksRepository(
  userId?: string,
  cafeId?: string,
): Promise<ReadKiosksRow[]> {
  if (userId) {
    return db
      .select({
        id: cafes.id,
        cafeName: cafes.name,
        kiosk: kiosks,
      })
      .from(cafes)
      .innerJoin(cafeUsers, eq(cafeUsers.cafeId, cafes.id))
      .leftJoin(kiosks, eq(kiosks.cafeId, cafes.id))
      .where(cafeId
        ? and(eq(cafeUsers.userId, userId), eq(cafes.id, cafeId))
        : eq(cafeUsers.userId, userId))
      .orderBy(asc(cafes.name), desc(kiosks.createdAt));
  }

  const query = db
    .select({
      id: cafes.id,
      cafeName: cafes.name,
      kiosk: kiosks,
    })
    .from(cafes)
    .leftJoin(kiosks, eq(kiosks.cafeId, cafes.id));

  return cafeId
    ? query.where(eq(cafes.id, cafeId)).orderBy(asc(cafes.name), desc(kiosks.createdAt))
    : query.orderBy(asc(cafes.name), desc(kiosks.createdAt));
}

export async function readPaginatedKiosksRepository({
  page,
  limit,
  search,
}: ReadPaginatedKiosksParams): Promise<ReadPaginatedKiosksResult> {
  const searchCondition = search
    ? or(
        ilike(kiosks.name, `%${search}%`),
        ilike(kiosks.kioskCode, `%${search}%`),
        ilike(cafes.name, `%${search}%`),
      )
    : undefined;
  const offset = (page - 1) * limit;

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)`.mapWith(Number) })
    .from(kiosks)
    .innerJoin(cafes, eq(cafes.id, kiosks.cafeId))
    .where(searchCondition);

  const rows = await db
    .select({ kiosk: kiosks, cafeName: cafes.name })
    .from(kiosks)
    .innerJoin(cafes, eq(cafes.id, kiosks.cafeId))
    .where(searchCondition)
    .orderBy(desc(kiosks.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    kiosks: rows.map(({ kiosk, cafeName }) => ({ ...kiosk, cafeName })),
    totalItems: countResult?.count ?? 0,
  };
}
