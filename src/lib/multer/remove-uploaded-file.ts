import { unlink } from "node:fs/promises";

/**
 * Menghapus file upload sementara jika proses penyimpanan gagal.
 *
 * Error penghapusan diabaikan jika file sudah tidak ada atau tidak dapat
 * dihapus.
 *
 * @param filePath - Path file upload yang akan dihapus.
 * @returns Promise yang selesai setelah proses penghapusan.
 */
export async function removeUploadedFile(filePath: string): Promise<void> {
  await unlink(filePath).catch(() => undefined);
}
  
