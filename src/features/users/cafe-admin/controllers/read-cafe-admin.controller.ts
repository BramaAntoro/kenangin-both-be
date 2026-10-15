import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import readCafeAdminService from "../services/read-cafe-admin.service.js";

/**
 * Menangani pembacaan daftar akun cafe admin oleh super admin.
 */
export default async function readCafeAdminController(
  _request: Request,
  response: Response,
): Promise<Response> {
  try {
    const cafeAdmins = await readCafeAdminService();

    return apiSuccess(
      response,
      { cafeAdmins },
      "Daftar cafe admin berhasil diambil",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
