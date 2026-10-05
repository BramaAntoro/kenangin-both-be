import z from "zod";
import AppError from "../app-error.js";
import parseJsonBody from "./parse-json-body.js";
import type { Request } from "express";
import { BodyValidationError } from "../errors/body-validation-error.js";

/**
 * Mem-parsing body request sebagai JSON lalu memvalidasinya menggunakan
 * schema Zod yang diberikan.
 * @template T - Tipe data yang dihasilkan oleh schema setelah validasi.
 * @param request - HTTP Request dengan body JSON yang akan divalidasi.
 * @param schema - Schema Zod yang digunakan untuk memvalidasi body request.
 * @returns Data request yang sudah diparsing dan tervalidasi dengan tipe T.
 * @throws {AppError} Jika body bukan JSON yang valid dengan status HTTP 400.
 * @throws {BodyValidationError} Jika data tidak sesuai schema dengan status
 * HTTP 400 dan detail error pada setiap field.
 */
export default async function parseAndValidateBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<T> {
  const body = await parseJsonBody(request);
  const validation = schema.safeParse(body);

  if (!validation.success) {
    throw new BodyValidationError(validation.error.flatten().fieldErrors);
  }

  return validation.data;
}
