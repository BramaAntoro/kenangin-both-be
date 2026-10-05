import AppError from "../app-error.js";
import { BodyValidationError } from "./parse-and-validate-body.js";

/**
 * Hasil normalisasi error sebelum diubah menjadi respons API.
 */
type HandleApiError = {
  message: string;
  statusCode: number;
  details?: unknown;
};

/**
 * Menormalisasi error menjadi pesan dan HTTP status code yang aman untuk API.
 *
 * AppError mempertahankan pesan dan status code yang sudah ditentukan.
 * Error lainnya disanitasi agar detail internal seperti query database
 * tidak dikirimkan kepada client.
 *
 * @param error - Error yang ditangkap oleh controller.
 * @returns Pesan dan HTTP status code untuk respons error.
 */
export default function handleApiError(error: unknown): HandleApiError {
  if (error instanceof BodyValidationError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      details: error.fieldErrors,
    };
  }

  if (error instanceof AppError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  return {
    message: "Terjadi kesalahan internal pada server, mohon tunggu sebentar",
    statusCode: 500,
  };
}
