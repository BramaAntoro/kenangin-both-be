import type { LoginDto } from "../dto/login.dto.js";
import findUserByEmailRepository from "../repositories/find-user-by-email.repository.js";
import AppError from "../../../../lib/app-error.js";
import comparePassword from "../../../../lib/password/compare-password.js";
import signToken from "../../../../lib/password/sign-token.js";
import type { UserResult } from "../../../../types/users/user-result.js";

/**
 * Format hasil response dari loginService.
 */
type LoginServiceResult = {
  status: boolean;
  message: string;
  user: UserResult;
  jwtToken: string;
};

/**
 * Menangani logika bisnis login user dengan memverifikasi email dan password,
 * menghapus password dari data user, lalu membuat JWT untuk autentikasi.
 * @param payload - Data login user yang telah sesuai dengan `loginSchema`.
 * @returns Object yang berisi status login, pesan, data user tanpa password,
 * dan JWT token.
 * @throws {AppError} Dengan status HTTP 422 jika user tidak ditemukan atau
 * password yang diberikan tidak cocok.
 */
export default async function loginService(
  payload: LoginDto,
): Promise<LoginServiceResult> {
  const { email, password } = payload;

  const existingUser = await findUserByEmailRepository(email);
  if (!existingUser) {
    throw new AppError(
      "Email atau password, periksa kembali data yang dimasukan",
      422,
    );
  }

  const passwordValid = await comparePassword(password, existingUser.password);
  if (!passwordValid) {
    throw new AppError(
      "Email atau password, periksa kembali data yang dimasukan",
      422,
    );
  }

  const { password: _password, ...user } = existingUser;

  const jwt = signToken(user);

  return {
    status: true,
    message: "Login berhasil, mulai untuk kenangin kenangan",
    user: user,
    jwtToken: jwt,
  };
}
