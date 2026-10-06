import AppError from "../../../lib/app-error.js";
import type { CreateCafeDto } from "../dto/create-cafe.dto.js";
import createCafeRepository from "../repositories/create-cafe.repository.js";
import existsCafeSlugRepository from "../repositories/exists-cafe-slug.repository.js";
import type { CreateCafeResult } from "../types/create-cafe-result.js";

/** Membuat slug URL-safe dari nama cafe. */
function createCafeSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Membuat cafe baru dan menghubungkannya dengan user cafe admin.
 *
 * @param payload - Data cafe yang sudah divalidasi.
 * @returns Data cafe beserta cafe admin yang direlasikan.
 * @throws {AppError} Jika slug sudah digunakan atau cafe admin tidak ditemukan.
 */
export default async function createCafeService(
  payload: CreateCafeDto,
): Promise<CreateCafeResult> {
  const {
    name,
    address,
    phone,
    cafeSharePercent,
    kenanginSharePercent,
    cafeAdminId,
  } = payload;
  const slug = createCafeSlug(name);

  if (!slug) {
    throw new AppError("Nama cafe tidak dapat digunakan sebagai slug", 400);
  }

  if (await existsCafeSlugRepository(slug)) {
    throw new AppError("Slug cafe sudah digunakan", 409);
  }

  const result = await createCafeRepository({
    name,
    slug,
    address,
    phone,
    cafeSharePercent,
    kenanginSharePercent,
    cafeAdminId,
  });

  if (!result) {
    throw new AppError("Cafe admin tidak ditemukan", 404);
  }

  return result;
}
