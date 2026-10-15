import AppError from "../../../../lib/app-error.js";
import hashPassword from "../../../../lib/password/hash-password.js";
import createCafeAdminRepository from "../repositories/create-cafe-admin.repository.js";
import existsUserByEmailRepository from "../repositories/exists-user-by-email.repository.js";
import type { UserResult } from "../../../../types/users/user-result.js";
import type { CreateCafeAdminDto } from "../dto/create-cafe-admin.dto.js";

/**
 * Format hasil pembuatan akun cafe admin.
 */
type CreateCafeAdminServiceResult = {
  status: boolean;
  message: string;
  user: UserResult;
};

/**
 * Membuat akun cafe admin baru.
 *
 * @param payload - Data akun cafe admin yang sudah divalidasi.
 * @returns Data akun baru tanpa password.
 * @throws {AppError} Jika email sudah digunakan.
 */
export default async function createCafeAdminService(
  payload: CreateCafeAdminDto,
): Promise<CreateCafeAdminServiceResult> {
  const { email, name, password } = payload;
  const existingUser = await existsUserByEmailRepository(email);

  if (existingUser) {
    throw new AppError("Email sudah digunakan", 409);
  }

  const hasedPassword = await hashPassword(password);
  const user = await createCafeAdminRepository({
    email,
    name,
    hasedPassword,
  });

  return {
    status: true,
    message: "Akun cafe admin berhasil dibuat",
    user,
  };
}
