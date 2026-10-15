import type { Request } from "express";

/**
 * Mengambil nilai cookie berdasarkan nama dari header Cookie request.
 *
 * @param request - Request Express yang berisi header cookie.
 * @param name - Nama cookie yang dicari.
 * @returns Nilai cookie atau `undefined` jika tidak ditemukan.
 */
export default function getCookie(
  request: Request,
  name: string,
): string | undefined {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return undefined;
  }

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined;
}
