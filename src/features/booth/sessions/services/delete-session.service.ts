import { join } from "node:path";
import AppError from "../../../../lib/app-error.js";
import { removeUploadedFile } from "../../../../lib/multer/remove-uploaded-file.js";
import deleteSessionRepository from "../repositories/delete-session.repository.js";
import { photoDirectory } from "../photo-file.js";

/**
 * Menghapus sesi dan foto lokalnya berdasarkan session code.
 *
 * @param sessionCode - Kode unik sesi yang akan dihapus.
 * @returns Sesi yang telah dihapus.
 * @throws AppError Jika sesi tidak ditemukan.
 */
export default async function deleteSessionService(sessionCode: string) {
  const session = await deleteSessionRepository(sessionCode);
  if (!session) throw new AppError("Session tidak ditemukan", 404);

  await removeUploadedFile(join(photoDirectory, `${sessionCode}.jpg`));
  return session;
}
