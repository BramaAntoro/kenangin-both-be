import AppError from "../../../lib/app-error.js";
import type { JwtTokenPayload } from "../../../types/jwt/jwt-token-payload.js";
import readBoothPackagesByCafeRepository from "../repositories/read-booth-packages-by-cafe.repository.js";
import type { BoothPackageResult } from "../../booth/packages/types/booth-package-result.js";

/** Bentuk cafe beserta paket booth yang dikembalikan API. */
type CafeBoothPackagesResult = {
  id: string;
  name: string;
  packages: BoothPackageResult[];
};

/**
 * Mengambil paket booth untuk satu cafe sesuai akses user.
 *
 * @param cafeId - ID cafe yang paketnya diminta.
 * @param user - Payload JWT untuk menentukan role dan kepemilikan cafe.
 * @returns Cafe beserta seluruh paket booth-nya.
 * @throws {AppError} Jika cafe tidak ditemukan atau user tidak memiliki akses.
 */
export default async function readBoothPackageCafeService(
  cafeId: string,
  user: JwtTokenPayload,
): Promise<CafeBoothPackagesResult> {
  const userId = user.role === "cafe_admin" ? user.id : undefined;
  const rows = await readBoothPackagesByCafeRepository(cafeId, userId);
  const cafe = rows[0];

  if (!cafe) {
    throw new AppError("Cafe tidak ditemukan", 404);
  }

  return {
    id: cafe.cafeId,
    name: cafe.cafeName,
    packages: rows.flatMap(({ boothPackage }) =>
      boothPackage ? [boothPackage as BoothPackageResult] : [],
    ),
  };
}
