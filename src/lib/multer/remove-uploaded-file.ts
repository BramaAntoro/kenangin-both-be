import { unlink } from "node:fs/promises";

/** Menghapus file upload sementara jika proses penyimpanan gagal. */
export async function removeUploadedFile(filePath: string): Promise<void> {
  await unlink(filePath).catch(() => undefined);
}
  
