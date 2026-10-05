import AppError from "../app-error.js";

/**
 * Merepresentasikan error ketika body request tidak sesuai dengan schema
 * validasi yang ditentukan.
 * Error ini mewarisi `AppError` dengan HTTP status code 400 dan menyimpan
 * detail error berdasarkan nama field agar dapat dikirimkan ke client.
 */
export class BodyValidationError extends AppError {
  /**
   * Membuat error validasi body request.
   * @param fieldErrors - Detail pesan error yang dikelompokkan berdasarkan
   * nama field yang gagal divalidasi.
   */
  constructor(public fieldErrors: Record<string, string[] | undefined>) {
    super("Data yang dikirimkan tidak valid", 400);
  }
}
