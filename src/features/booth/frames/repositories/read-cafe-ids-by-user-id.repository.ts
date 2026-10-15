import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { cafeUsers } from "../../../../db/schema.js";

/**
 * Mengambil seluruh ID cafe yang terhubung ke user.
 *
 * Repository ini membaca tabel `cafe_users` dan mengembalikan semua cafe
 * yang memiliki relasi dengan user tersebut. Jika user belum terhubung ke
 * cafe mana pun, hasilnya berupa array kosong.
 *
 * @param userId - ID user yang ingin dicari relasi cafe-nya.
 * @returns Promise berisi daftar ID cafe yang terhubung ke user.
 */
export default async function readCafeIdsByUserIdRepository(
  userId: string,
): Promise<string[]> {
  const rows = await db
    .select({ cafeId: cafeUsers.cafeId })
    .from(cafeUsers)
    .where(eq(cafeUsers.userId, userId));

  return rows.map(({ cafeId }) => cafeId);
}
