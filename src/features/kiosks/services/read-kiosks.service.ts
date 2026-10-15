import type { JwtTokenPayload } from "../../../types/jwt/jwt-token-payload.js";
import readKiosksRepository from "../repositories/read-kiosks.repository.js";
import type { ReadKiosksResult } from "../types/read-kiosks-result.js";

/**
 * Mengambil daftar kiosk yang dikelompokkan berdasarkan nama cafe.
 *
 * - `super_admin`: Mengambil seluruh kiosk dari semua cafe.
 * - `cafe_admin`: Hanya mengambil kiosk dari cafe yang dikelolanya.
 *
 * @param user - Payload user dari token autentikasi.
 * @returns Object berformat { [namaCafe]: KioskResult[] }.
 */
export default async function readKiosksService(
  user: JwtTokenPayload,
): Promise<ReadKiosksResult> {
  const userId = user.role === "cafe_admin" ? user.id : undefined;
  const rows = await readKiosksRepository(userId);

  const grouped: ReadKiosksResult = {};

  rows.forEach(({ cafeName, kiosk }) => {
    if (!grouped[cafeName]) {
      grouped[cafeName] = [];
    }

    if (kiosk) {
      grouped[cafeName]?.push(kiosk);
    }
  });

  return grouped;
}
