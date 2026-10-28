import { desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { users } from "../../../../db/schema.js";
import type { ReadCafeAdminResult } from "../types/read-cafe-admin-result.js";

export type ReadCafeAdminParams = {
  page: number;
  limit: number;
  search?: string | undefined;
};

export type ReadCafeAdminsResult = {
  cafeAdmins: ReadCafeAdminResult[];
  totalItems: number;
};

/**
 * Mengambil seluruh user dengan role cafe admin.
 */
export default async function readCafeAdminRepository({
  page,
  limit,
  search,
}: ReadCafeAdminParams): Promise<ReadCafeAdminsResult> {
  const searchCondition = search
    ? or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`))
    : undefined;
  const where = searchCondition
    ? sql`${eq(users.role, "cafe_admin")} AND ${searchCondition}`
    : eq(users.role, "cafe_admin");
  const offset = (page - 1) * limit;

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)`.mapWith(Number) })
    .from(users)
    .where(where);

  const cafeAdmins = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      accountNumber: users.accountNumber,
      bankName: users.bankName,
      tanggalBergabung: users.createdAt,
    })
    .from(users)
    .where(where)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  return { cafeAdmins, totalItems: countResult?.count ?? 0 };
}
