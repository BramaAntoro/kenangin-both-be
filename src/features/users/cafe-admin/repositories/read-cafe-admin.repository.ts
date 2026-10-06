import { desc, eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { users } from "../../../../db/schema.js";
import type { ReadCafeAdminResult } from "../types/read-cafe-admin-result.js";

/**
 * Mengambil seluruh user dengan role cafe admin.
 */
export default async function readCafeAdminRepository(): Promise<
  ReadCafeAdminResult[]
> {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      tanggalBergabung: users.createdAt,
    })
    .from(users)
    .where(eq(users.role, "cafe_admin"))
    .orderBy(desc(users.createdAt));
}
