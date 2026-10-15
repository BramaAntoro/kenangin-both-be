import { and, eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafeUsers, cafes, users } from "../../../db/schema.js";
import type { CreateCafeResult } from "../types/create-cafe-result.js";

/**
 * Data cafe dan admin cafe yang dibutuhkan repository untuk proses pembuatan.
 */
type CreateCafeRepositoryData = {
  name: string;
  slug: string;
  address: string;
  phone: string;
  cafeSharePercent: number;
  kenanginSharePercent: number;
  cafeAdminId: string;
};

/**
 * Membuat cafe dan relasinya dengan user cafe admin dalam satu transaksi.
 *
 * @param data - Data cafe dan ID user cafe admin.
 * @returns Data cafe beserta cafe admin yang direlasikan, atau `undefined` jika admin tidak ditemukan.
 */
export default async function createCafeRepository(
  data: CreateCafeRepositoryData,
): Promise<CreateCafeResult | undefined> {
  return db.transaction(async (transaction) => {
    const [cafeAdmin] = await transaction
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })
      .from(users)
      .where(
        and(eq(users.id, data.cafeAdminId), eq(users.role, "cafe_admin")),
      );

    if (!cafeAdmin) {
      return undefined;
    }

    const [cafe] = await transaction
      .insert(cafes)
      .values({
        name: data.name,
        slug: data.slug,
        address: data.address,
        phone: data.phone,
        cafeSharePercent: data.cafeSharePercent,
        kenanginSharePercent: data.kenanginSharePercent,
      })
      .returning();

    if (!cafe) {
      return undefined;
    }

    await transaction.insert(cafeUsers).values({
      cafeId: cafe.id,
      userId: cafeAdmin.id,
    });

    return { cafe, cafeAdmin };
  });
}
