import type { Response } from "express";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_EXPIRES_IN_SECONDS, NODE_ENV } from "../get-env.js";

/**
 * Menyimpan JWT ke dalam response sebagai cookie autentikasi.
 *
 * Cookie dikonfigurasi sebagai httpOnly agar tidak dapat diakses melalui
 * JavaScript di browser. Cookie juga dikirim pada request ke seluruh path
 * aplikasi dan, pada production, hanya melalui koneksi HTTPS.
 *
 * @param response - Response HTTP yang akan ditambahkan cookie autentikasi.
 * @param jwtToken - JWT yang disimpan sebagai nilai cookie token.
 * @returns Response Express setelah cookie token ditambahkan.
 */
export default function setCookies(
  response: Response,
  jwtToken: string,
): Response {
  const cookies = response.cookie(AUTH_COOKIE_NAME, jwtToken, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_TOKEN_EXPIRES_IN_SECONDS * 1000,
  });

  return cookies;
}
