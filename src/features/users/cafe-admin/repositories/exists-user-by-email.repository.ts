import { and, eq, ne } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { users } from "../../../../db/schema.js";

/**
 * Mengecek apakah email sudah digunakan oleh user lain.
 *
 * @param email - Alamat email yang akan diperiksa keberadaannya.
 * @param excludeUserId - ID user yang dikecualikan dari pemeriksaan (opsional, untuk proses pembaruan).
 * @returns Promise yang menghasilkan boolean (`true` jika email sudah digunakan, `false` jika belum).
 */
export default async function existsUserByEmailRepository(
  email: string,
  excludeUserId?: string,
): Promise<boolean> {
  const [result] = await db
    .select({ id: users.id })
    .from(users)
    .where(
      excludeUserId
        ? and(eq(users.email, email), ne(users.id, excludeUserId))
        : eq(users.email, email),
    );

  return Boolean(result);
}
