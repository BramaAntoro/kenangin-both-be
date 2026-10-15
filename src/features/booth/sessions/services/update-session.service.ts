import AppError from "../../../../lib/app-error.js";
import type { UpdateSessionDto } from "../dto/update-session.dto.js";
import { readSession } from "../repositories/read-session-by-sessioncode.repository.js";
import { default as updateSession } from "../repositories/update-session.repository.js";
import { getPhotoUrl } from "../photo-file.js";

/**
 * Memperbarui data sesi dan URL foto bila foto baru diunggah.
 *
 * @param sessionCode - Kode unik sesi yang akan diperbarui.
 * @param changes - Field sesi yang akan diubah.
 * @param hasPhoto - Menandakan apakah request membawa foto baru.
 * @returns Data sesi setelah pembaruan.
 * @throws AppError Jika sesi tidak ditemukan atau tidak ada perubahan.
 */
export default async function updateSessionService(
  sessionCode: string,
  changes: UpdateSessionDto,
  hasPhoto: boolean,
) {
  const isSecction = await readSession(sessionCode)
  if (!isSecction)
    throw new AppError("Session tidak ditemukan", 404);
  
  if (!hasPhoto && Object.keys(changes).length === 0) {
    throw new AppError("Minimal satu field wajib dikirim", 400);
  }

  const session = await updateSession(sessionCode, {
    ...changes,
    ...(hasPhoto ? { softfileUrl: getPhotoUrl(`${sessionCode}.jpg`) } : {}),
  });
  if (!session) throw new AppError("Session tidak ditemukan", 404);
  return session;
}
