import type { Request, Response } from "express";
import parseAndValidateBody from "../../../lib/api/parse-and-validate-body.js";
import { createCafeAdminSchema } from "../../users/cafe-admin/dto/create-cafe-admin.dto.js";
import createCafeAdminService from "../../users/cafe-admin/services/create-cafe-admin.service.js";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import setCookies from "../../../lib/jwt/set-cookies.js";
import signToken from "../../../lib/password/sign-token.js";

export default async function registerController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const payload = await parseAndValidateBody(request, createCafeAdminSchema);
    const { user } = await createCafeAdminService(payload);
    setCookies(response, signToken(user));
    return apiSuccess(response, { user }, "Akun berhasil dibuat", 201);
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
