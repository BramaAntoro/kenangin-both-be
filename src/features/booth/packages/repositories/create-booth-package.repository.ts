import { db } from "../../../../db/index.js";
import { boothPackages } from "../../../../db/schema.js";
import type { BoothPackageResult } from "../types/booth-package-result.js";

/**
 * Data yang dibutuhkan repository untuk membuat paket booth baru.
 */
type CreateBoothPackageRepositoryData = {
  cafeId: string;
  name: string;
  price: number;
  photoShotsCount: number;
  printCopiesCount: number;
  features: Record<string, unknown>;
  description?: string | undefined;
};

/**
 * Menyimpan data paket booth baru ke database.
 *
 * @param data - Data paket booth yang akan disimpan.
 * @returns Data paket booth yang berhasil dibuat.
 */
export default async function createBoothPackageRepository(
  data: CreateBoothPackageRepositoryData,
): Promise<BoothPackageResult | undefined> {
  const [result] = await db
    .insert(boothPackages)
    .values({
      cafeId: data.cafeId,
      name: data.name,
      price: data.price,
      photoShotsCount: data.photoShotsCount,
      printCopiesCount: data.printCopiesCount,
      features: data.features,
      description: data.description,
    })
    .returning();

  return result as BoothPackageResult | undefined;
}
