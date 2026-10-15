import AppError from "../../../../lib/app-error.js";
import { readSessionRepository } from "../repositories/read-session-by-sessioncode.repository.js";

/**
 * Mengambil data sesi berdasarkan session code.
 *
 * @param sessionCode - Kode unik sesi yang dicari.
 * @returns Data publik sesi.
 * @throws AppError Jika sesi tidak ditemukan.
 */
export default async function readSessionService(sessionCode: string) {
  const session = await readSessionRepository(sessionCode);
  if (!session) throw new AppError("Session tidak ditemukan", 404);
  return session;
}
