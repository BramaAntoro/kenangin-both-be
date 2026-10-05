import { eq } from "drizzle-orm";
import type { AuthUserResult } from "../types/auth-user-result.js";
import { db } from "../../../db/index.js";
import { users } from "../../../db/schema.js";

type ExsistingUserReponsitoryResult = AuthUserResult & {
  password: string;
};

/**
 * Mengecek apakah email sudah terdaftar di table users
 * @param email - Sebagai identifier untuk pengecekan didalam table
 * @returns Object berisi data user jika ditemukan atau null jika tidak ada
 */
export default async function existingUserRepository(
  email: string,
): Promise<ExsistingUserReponsitoryResult | null> {
  const [result] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      password: users.password,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, email));

  return result || null;
}
