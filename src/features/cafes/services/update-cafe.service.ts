import AppError from "../../../lib/app-error.js";
import type { UpdateCafeDto } from "../dto/update-cafe.dto.js";
import existsCafeNameRepository from "../repositories/exists-cafe-name.repository.js";
import existsCafeSlugRepository from "../repositories/exists-cafe-slug.repository.js";
import updateCafeRepository from "../repositories/update-cafe.repository.js";
import type { ReadCafeResult } from "../repositories/read-cafes.repository.js";
import createCafeSlug from "../utils/create-cafe-slug.js";

/**
 * Memperbarui data cafe dan relasi cafe admin.
 *
 * @param id - ID cafe yang akan diperbarui.
 * @param payload - Data perubahan cafe yang sudah divalidasi.
 * @returns Data cafe yang berhasil diperbarui beserta nama adminnya.
 * @throws {AppError} Jika nama atau slug sudah digunakan, atau cafe/admin tidak ditemukan.
 */
export default async function updateCafeService(
  id: string,
  payload: UpdateCafeDto,
): Promise<ReadCafeResult> {
  const slug = payload.name ? createCafeSlug(payload.name) : undefined;

  if (payload.name && await existsCafeNameRepository(payload.name, id)) {
    throw new AppError("Nama cafe sudah digunakan", 409);
  }

  if (slug && await existsCafeSlugRepository(slug, id)) {
    throw new AppError("Slug cafe sudah digunakan", 409);
  }

  const result = await updateCafeRepository({ ...payload, id, slug });

  if (!result) {
    throw new AppError("Cafe atau cafe admin tidak ditemukan", 404);
  }

  return result;
}
