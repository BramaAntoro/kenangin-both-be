import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { users } from "../../../../db/schema.js";

/**
 * Mengecek apakah email sudah digunakan oleh user lain.
 */
export default async function existsUserByEmailRepository(
  email: string,
): Promise<boolean> {
  const [result] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email));

  return Boolean(result);
}
