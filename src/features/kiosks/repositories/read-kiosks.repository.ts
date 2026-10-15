import { asc, desc, eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafeUsers, cafes, kiosks } from "../../../db/schema.js";
import type { KioskResult } from "../types/kiosk-result.js";

export type ReadKiosksRow = {
  id: string;
  cafeName: string;
  kiosk: KioskResult | null;
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
      .where(eq(cafeUsers.userId, userId))
      .orderBy(asc(cafes.name), desc(kiosks.createdAt));
  }

  return db
    .select({
      id: cafes.id,
      cafeName: cafes.name,
      kiosk: kiosks,
    })
    .from(cafes)
    .leftJoin(kiosks, eq(kiosks.cafeId, cafes.id))
    .orderBy(asc(cafes.name), desc(kiosks.createdAt));
}
