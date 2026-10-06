import { and, eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { users } from "../../../../db/schema.js";
import type { UserResult } from "../../../../types/users/user-result.js";

/**
 * Menghapus akun cafe admin berdasarkan ID.
 *
 * @param id - ID akun cafe admin yang akan dihapus.
 * @returns Data akun cafe admin yang dihapus atau `undefined` jika tidak ditemukan.
 */
export default async function deleteCafeAdminRepository(
  id: string,
): Promise<UserResult | undefined> {
  const [result] = await db
    .delete(users)
    .where(and(eq(users.id, id), eq(users.role, "cafe_admin")))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    });

  return result;
}
