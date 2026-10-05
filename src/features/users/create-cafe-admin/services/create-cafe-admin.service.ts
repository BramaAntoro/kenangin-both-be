import AppError from "../../../../lib/app-error.js";
import hashPassword from "../../../../lib/password/hash-password.js";
import createCafeAdminRepository from "../../repositories/create-cafe-admin.repository.js";
import existingUserRepository from "../../../auth/repositories/existing-user.repository.js";
import type { AuthUserResult } from "../../../auth/types/auth-user-result.js";
import type { CreateCafeAdminDto } from "../dto/create-cafe-admin.dto.js";

/**
 * Format hasil pembuatan akun cafe admin.
 */
type CreateCafeAdminServiceResult = {
  status: boolean;
  message: string;
  user: AuthUserResult;
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
  const existingUser = await existingUserRepository(payload.email);

  if (existingUser) {
    throw new AppError("Email sudah digunakan", 409);
  }

  const hasedPassword = await hashPassword(payload.password);
  const user = await createCafeAdminRepository({
    email: payload.email,
    name: payload.name,
    hasedPassword,
  });

  return {
    status: true,
    message: "Akun cafe admin berhasil dibuat",
    user,
  };
}
