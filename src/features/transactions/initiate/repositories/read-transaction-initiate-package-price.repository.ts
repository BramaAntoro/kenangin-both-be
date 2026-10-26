import { and, eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { boothPackages, cafeUsers, kiosks } from "../../../../db/schema.js";

/**
 * Mengambil paket aktif pada kiosk aktif yang dikelola oleh user.
 *
 * @param input - ID user, paket, dan kiosk yang akan dicari.
 * @returns Data harga dan nama paket, atau `undefined` jika tidak ditemukan.
 */
export default async function readTransactionInitiatePackagePriceRepository(
  input: { userId: string; packageId: string; kioskId: string },
) {
  const [result] = await db
    .select({
      price: boothPackages.price,
      name: boothPackages.name,
      cafeId: kiosks.cafeId,
      kioskId: kiosks.id,
    })
    .from(boothPackages)
    .innerJoin(kiosks, eq(kiosks.cafeId, boothPackages.cafeId))
    .innerJoin(
      cafeUsers,
      and(
        eq(cafeUsers.cafeId, kiosks.cafeId),
        eq(cafeUsers.userId, input.userId),
      ),
    )
    .where(
      and(
        eq(boothPackages.id, input.packageId),
        eq(boothPackages.isActive, true),
        eq(kiosks.status, "active"),
        eq(kiosks.id, input.kioskId),
      ),
    )
    .limit(1);

  return result;
}
