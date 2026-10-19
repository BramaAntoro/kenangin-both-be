import type { Request, Response } from "express";
import { apiSuccess } from "../../lib/api/api-response.js";

export default function readCurrentUserController(
  request: Request,
  response: Response,
): Response {
  return apiSuccess(response, { user: request.user! }, "Profil berhasil diambil");
}
