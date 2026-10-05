import AppError from "../app-error.js";

/**
 * Memvalidasi parameter ID dari route Express.
 *
 * @param id - Nilai parameter route yang akan divalidasi.
 * @returns ID dalam bentuk string yang sudah dipastikan tidak kosong.
 * @throws {AppError} Jika ID bukan string atau hanya berisi whitespace.
 */
export default function parseParams(id: unknown): string {
  if (typeof id !== "string" || !id.trim()) {
    throw new AppError("ID tidak valid atau tidak ditemukan", 400);
  }

  return id;
}
