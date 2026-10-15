import AppError from "../../../../lib/app-error.js";
import hashPassword from "../../../../lib/password/hash-password.js";
import type { UserResult } from "../../../../types/users/user-result.js";
import type { UpdateCafeAdminDto } from "../dto/update-cafe-admin.dto.js";
import existsUserByEmailRepository from "../repositories/exists-user-by-email.repository.js";
import updateCafeAdminRepository from "../repositories/update-cafe-admin.repository.js";

/**
 * Data parameter yang dibutuhkan service untuk memperbarui akun cafe admin.
 */
type UpdateCafeAdminServiceData = {
  id: string;
} & UpdateCafeAdminDto;

/**
 * Memperbarui akun cafe admin dan memastikan email tidak duplikat.
 *
 * @param payload - Data pembaruan akun cafe admin yang berisi ID dan data yang diubah (email, nama, atau password).
 * @returns Data akun cafe admin yang berhasil diperbarui tanpa password.
 * @throws {AppError} Jika email sudah digunakan (409) atau akun cafe admin tidak ditemukan (404).
 */

export default async function updateCafeAdminService(
  payload: UpdateCafeAdminServiceData,
): Promise<UserResult> {
  const { id, email, name, password } = payload
  if (email) {
    const existingUser = await existsUserByEmailRepository(email, id);

    if (existingUser) {
      throw new AppError("Email sudah digunakan", 409);
    }
  }

  const hashedPassword =
    password !== undefined ? await hashPassword(password) : undefined;

  const result = await updateCafeAdminRepository({
    id,
    email,
    name,
    hashedPassword,
  });

  if (!result) {
    throw new AppError("Akun cafe admin tidak ditemukan", 404);
  }

  return result;
}
