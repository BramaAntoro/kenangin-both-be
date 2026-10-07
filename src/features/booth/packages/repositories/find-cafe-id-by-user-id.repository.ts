import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { cafeUsers } from "../../../../db/schema.js";

/**
 * Mencari cafe_id berdasarkan user_id dari tabel cafe_users.
 *
 * @param userId - ID user yang sedang login.
 * @returns Object berisi `cafeId` atau `undefined` jika user belum terhubung ke cafe.
 */
export default async function findCafeIdByUserIdRepository(
  userId: string,
): Promise<{ cafeId: string } | undefined> {
  const [result] = await db
    .select({ cafeId: cafeUsers.cafeId })
    .from(cafeUsers)
    .where(eq(cafeUsers.userId, userId));

  return result;
}

