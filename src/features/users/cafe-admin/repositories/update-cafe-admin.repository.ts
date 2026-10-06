import { and, eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { users } from "../../../../db/schema.js";
import type { UserResult } from "../../../../types/users/user-result.js";

/**
 * Data yang dibutuhkan repository untuk memperbarui akun cafe admin.
 */
type UpdateCafeAdminRepositoryData = {
  id: string;
  email?: string | undefined;
  name?: string | undefined;
  hashedPassword?: string | undefined;
};

/**
 * Memperbarui akun cafe admin di database tanpa mengembalikan password.
 *
 * @param data - Data akun cafe admin yang akan diperbarui di database.
 * @returns Data akun cafe admin yang berhasil diperbarui atau `undefined` jika tidak ditemukan.
 */
export default async function updateCafeAdminRepository(
  data: UpdateCafeAdminRepositoryData,
): Promise<UserResult | undefined> {
  const [result] = await db
    .update(users)
    .set({
      email: data.email,
      name: data.name,
      password: data.hashedPassword,
      updatedAt: new Date(),
    })
    .where(and(eq(users.id, data.id), eq(users.role, "cafe_admin")))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    });

  return result;
}
