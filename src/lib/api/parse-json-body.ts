import type { Request } from "express";
import AppError from "../app-error.js";

/**
 * Digunakan untuk memparsing request sebagai JSON.
 * @param request - HTTP request yang body nya diharapkan berupa JSON.
 * @returns Body request yang sudah diparsing dan belum divalidasi.
 * @throws {AppError} Jika body request bukan JSON yang valid.
 */
export default async function parseJsonBody(
  request: Request,
): Promise<unknown> {
  if (request.body === undefined) {
    throw new AppError("Request body harus berupa JSON yang valid", 400);
  }

  return request.body;
}
