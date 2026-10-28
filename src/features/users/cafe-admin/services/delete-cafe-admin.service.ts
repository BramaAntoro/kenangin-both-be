import AppError from "../../../../lib/app-error.js";
import type { UserResult } from "../../../../types/users/user-result.js";
import readCafeAdminCafesRepository from "../repositories/read-cafe-admin-cafes.repository.js";
import deleteCafeAdminRepository from "../repositories/delete-cafe-admin.repository.js";

/**
 * Menghapus akun cafe admin berdasarkan ID.
 *
 * @param id - ID akun cafe admin yang akan dihapus.
 * @returns Data akun cafe admin yang berhasil dihapus.
 * @throws {AppError} Jika akun cafe admin tidak ditemukan.
 */
export default async function deleteCafeAdminService(
  id: string,
): Promise<UserResult> {
  const cafes = await readCafeAdminCafesRepository(id);

  if (cafes.length > 0) {
    const cafeNames = cafes.map((cafe) => cafe.name).join(", ");
    throw new AppError(
      `Akun admin kafe tidak bisa dihapus karena masih terhubung dengan cafe: ${cafeNames}. Hapus atau pindahkan relasi cafe terlebih dahulu.`,
      409,
    );
  }

  const result = await deleteCafeAdminRepository(id);

  if (!result) {
    throw new AppError("Akun cafe admin tidak ditemukan", 404);
  }

  return result;
}
