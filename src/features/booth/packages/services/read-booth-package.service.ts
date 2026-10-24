import type { JwtTokenPayload } from "../../../../types/jwt/jwt-token-payload.js";
import AppError from "../../../../lib/app-error.js";
import readBoothPackagesRepository, {
  readPaginatedBoothPackagesRepository,
} from "../repositories/read-booth-packages.repository.js";
import type { BoothPackageResult } from "../types/booth-package-result.js";

/**
 * Bentuk cafe beserta paket booth yang dikembalikan service.
 */
type CafeBoothPackagesResult = {
  id: string;
  name: string;
  packages: BoothPackageResult[];
};
type PaginationOptions = {
  page: number;
  limit: number;
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
    const cafe = cafesById[cafeId] ?? (cafesById[cafeId] = {
      id: cafeId,
      name: cafeName,
      packages: [],
    });
    if (boothPackage) cafe.packages.push(boothPackage);
  });

  return Object.values(cafesById);
}

export async function readCafeBoothPackagesService(
  user: JwtTokenPayload,
  cafeId: string,
  options: PaginationOptions,
): Promise<{
  cafe: CafeBoothPackagesResult;
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}> {
  const userId = user.role === "cafe_admin" ? user.id : undefined;
  const result = await readPaginatedBoothPackagesRepository(
    userId,
    cafeId,
    options,
  );
  if (!result.cafe) throw new AppError("Cafe tidak ditemukan", 404);

  return {
    cafe: {
      ...result.cafe,
      packages: result.rows.map(({ boothPackage }) => boothPackage),
    },
    meta: {
      currentPage: options.page,
      perPage: options.limit,
      totalItems: result.totalItems,
      totalPages: Math.ceil(result.totalItems / options.limit),
    },
  };
}
