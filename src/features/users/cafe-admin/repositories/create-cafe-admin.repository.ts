import { db } from "../../../../db/index.js";
import { users } from "../../../../db/schema.js";
import type { UserResult } from "../../../../types/users/user-result.js";

type CreateCafeAdminData = {
  email: string;
  name: string;
  hasedPassword: string
}

/**
 * Menyimpan akun cafe admin baru ke database.
 *
 * @param data - Data user dengan password yang sudah di-hash.
 * @returns Data akun yang dibuat tanpa password.
 */
export default async function createCafeAdminRepository(data: CreateCafeAdminData): Promise<UserResult> {
  const [result] = await db
    .insert(users)
    .values({
      email: data.email,
      name: data.name,
      password: data.hasedPassword,
      role: "cafe_admin",
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    });

  if (!result) {
    throw new Error("Akun cafe admin gagal dibuat");
  }

  return result;
}
