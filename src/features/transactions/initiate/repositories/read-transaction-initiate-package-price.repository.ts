import { and, eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { boothPackages, kiosks } from "../../../../db/schema.js";

/**
 * Mengambil nama dan harga paket yang aktif untuk cafe dan kiosk aktif.
 *
 * @param input - ID cafe, paket, dan kiosk yang akan dicari.
 * @returns Data harga dan nama paket, atau `undefined` jika tidak ditemukan.
 */
export default async function readTransactionInitiatePackagePriceRepository(
  input: { cafeId: string; packageId: string; kioskId: string },
) {
  const [result] = await db
    .select({ price: boothPackages.price, name: boothPackages.name })
    .from(boothPackages)
    .innerJoin(kiosks, eq(kiosks.cafeId, boothPackages.cafeId))
    .where(
      and(
        eq(boothPackages.cafeId, input.cafeId),
        eq(boothPackages.id, input.packageId),
        eq(boothPackages.isActive, true),
        eq(kiosks.id, input.kioskId),
        eq(kiosks.status, "active"),
      ),
    )
    .limit(1);

  return result;
}
