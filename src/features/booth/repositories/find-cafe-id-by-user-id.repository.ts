import { and, eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafeUsers } from "../../../db/schema.js";

/**
 * Mencari relasi cafe_id berdasarkan user_id dari tabel cafe_users.
 * Jika cafeId diberikan, hanya relasi ke cafe tersebut yang dicari.
 *
 * @param userId - ID user yang sedang login.
 * @param cafeId - ID Cafe yang akan di cek
 * @returns Object berisi `cafeId` atau `undefined` jika user belum terhubung ke cafe.
 */
export default async function findCafeIdByUserIdRepository(
  userId: string,
  cafeId?: string,
): Promise<{ cafeId: string } | undefined> {
  const [result] = await db
    .select({ cafeId: cafeUsers.cafeId })
    .from(cafeUsers)
    .where(
      cafeId
        ? and(eq(cafeUsers.userId, userId), eq(cafeUsers.cafeId, cafeId))
        : eq(cafeUsers.userId, userId),
    )
    .limit(1);

  return result;
}
