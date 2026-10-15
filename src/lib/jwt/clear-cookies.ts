import type { Response } from "express";
import { AUTH_COOKIE_NAME, NODE_ENV } from "../get-env.js";

/**
 * Menghapus cookie JWT autentikasi dari response.
 *
 * Opsi cookie harus konsisten dengan cookie saat dibuat, terutama `path` dan
 * `secure`, agar browser dapat menemukan dan menghapus cookie yang sama.
 *
 * @param response - Response Express yang digunakan untuk menghapus cookie.
 * @returns Response Express setelah cookie autentikasi dihapus.
 */
export default function clearCookies(response: Response): Response {
  return response.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}
