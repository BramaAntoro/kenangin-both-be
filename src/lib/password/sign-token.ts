import jwt from "jsonwebtoken";
import type { JwtTokenPayload } from "../../types/jwt/jwt-token-payload.js";
import { AUTH_TOKEN_EXPIRES_IN_SECONDS, JWT_AUDIENCE, JWT_ISSUER, JWT_SECRET } from "../get-env.js";

/**
 * Membuat JWT token dengan masa berlaku 1 hari.
 * @param payload - Objek data yang akan disimpan di dalam JWT payload.
 * @returns String JWT token yang telah ditandatangani.
 */
export default function signToken(payload: JwtTokenPayload): string {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: AUTH_TOKEN_EXPIRES_IN_SECONDS,
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  });
  return token;
}
