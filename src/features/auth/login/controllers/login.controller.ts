import type { Request, Response } from "express";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import { loginSchema } from "../dto/login.dto.js";
import loginService from "../services/login.service.js";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import setCookies from "../../../../lib/jwt/set-cookies.js";

/**
 * Menangani proses login user: memvalidasi kredensial, membuat response
 * autentikasi, dan memasang cookie JWT pada response tersebut.
 * @param request - HTTP Request yang body-nya berisi email dan password user.
 * @param response - Response Express untuk mengirim hasil request.
 * @returns Promise yang menghasilkan Response Express dengan kemungkinan HTTP status:
 *   - 201 - Login berhasil, berisi data user tanpa password dan cookie JWT.
 *   - 400 - Body atau kredensial yang dikirimkan tidak valid.
 *   - 422 - Email atau password tidak cocok.
 *   - 500 - Terjadi kesalahan internal pada server.
 */
export default async function loginController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const validatedData = await parseAndValidateBody(
      request,
      loginSchema,
    );
    const result = await loginService(validatedData);

    setCookies(response, result.jwtToken);

    return apiSuccess(response, { user: result.user }, "Login berhasil", 201);
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
