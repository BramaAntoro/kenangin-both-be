import { and, eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafeUsers, cafes, users } from "../../../db/schema.js";
import type { ReadCafeResult } from "./read-cafes.repository.js";

/** Data perubahan cafe yang dibutuhkan repository. */
type UpdateCafeRepositoryData = {
  id: string;
  name?: string | undefined;
  slug?: string | undefined;
  address?: string | undefined;
  phone?: string | undefined;
  cafeSharePercent?: number | undefined;
  kenanginSharePercent?: number | undefined;
  cafeAdminId?: string | undefined;
};

/**
 * Memperbarui data cafe dan relasi admin cafe dalam satu transaksi.
 *
 * @param data - Data cafe yang akan diperbarui.
 * @returns Data cafe yang telah diperbarui atau `undefined` jika cafe maupun admin tidak ditemukan.
 */
export default async function updateCafeRepository(
  data: UpdateCafeRepositoryData,
): Promise<ReadCafeResult | undefined> {
  return db.transaction(async (transaction) => {
    const [existingCafe] = await transaction
      .select({ id: cafes.id })
      .from(cafes)
      .where(eq(cafes.id, data.id));

    if (!existingCafe) {
      return undefined;
    }

    if (data.cafeAdminId) {
      const [cafeAdmin] = await transaction
        .select({ id: users.id })
        .from(users)
        .where(
          and(
            eq(users.id, data.cafeAdminId),
            eq(users.role, "cafe_admin"),
          ),
        );

      if (!cafeAdmin) {
        return undefined;
      }
    }

    const [cafe] = await transaction
      .update(cafes)
      .set({
        name: data.name,
        slug: data.slug,
        address: data.address,
        phone: data.phone,
        cafeSharePercent: data.cafeSharePercent,
        kenanginSharePercent: data.kenanginSharePercent,
        updatedAt: new Date(),
      })
      .where(eq(cafes.id, data.id))
      .returning();

    if (!cafe) {
      return undefined;
    }

    if (data.cafeAdminId) {
      await transaction
        .update(cafeUsers)
        .set({ userId: data.cafeAdminId })
        .where(eq(cafeUsers.cafeId, data.id));
    }

    const [cafeAdmin] = await transaction
      .select({ name: users.name })
      .from(cafeUsers)
      .innerJoin(users, and(eq(users.id, cafeUsers.userId), eq(users.role, "cafe_admin")))
      .where(eq(cafeUsers.cafeId, cafe.id));

    if (!cafeAdmin) {
      return undefined;
    }

    return { cafe, cafeAdmin: cafeAdmin.name };
  });
}
