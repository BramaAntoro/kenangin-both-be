import type { JwtTokenPayload } from "../../../../types/jwt/jwt-token-payload.js";
import readBoothPackagesRepository from "../repositories/read-booth-packages.repository.js";
import type { BoothPackageResult } from "../types/booth-package-result.js";

/**
 * Bentuk cafe beserta paket booth yang dikembalikan service.
 */
type CafeBoothPackagesResult = {
  id: string;
  name: string;
  packages: BoothPackageResult[];
};

/**
 * Mengambil cafe beserta paket booth-nya.
 *
 * - `super_admin` dapat melihat paket seluruh cafe.
 * - `cafe_admin` hanya dapat melihat paket dari cafe yang dikelolanya.
 *
 * Paket dikelompokkan berdasarkan `cafeId`, sehingga nama cafe tidak digunakan
 * sebagai key dan cafe dengan nama yang sama tetap dapat dibedakan.
 *
 * @param user - Payload JWT user yang menentukan cakupan data.
 * @returns Daftar cafe dengan paket booth dalam properti `packages`.
 * @throws Error jika repository gagal mengambil data dari database.
 */
export default async function readBoothPackageService(
  user: JwtTokenPayload,
): Promise<CafeBoothPackagesResult[]> {
  const userId = user.role === "cafe_admin" ? user.id : undefined;
  const rows = await readBoothPackagesRepository(userId);

  const cafesById: Record<string, CafeBoothPackagesResult> = {};

  rows.forEach(({ cafeId, cafeName, boothPackage }) => {
    const cafe =
      cafesById[cafeId] ??
      (cafesById[cafeId] = {
        id: cafeId,
        name: cafeName,
        packages: [],
      });

    if (boothPackage) {
      cafe.packages.push(boothPackage);
    }
  });

  const cafes = Object.values(cafesById);

  return cafes;
}
