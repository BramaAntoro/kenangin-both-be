import type { JwtTokenPayload } from "./jwt/jwt-token-payload.js";

/**
 * Memperluas tipe bawaan Express agar request dapat menyimpan payload user
 * yang telah diverifikasi oleh authentication middleware.
 */
declare global {
  namespace Express {
    interface Request {
      /**
       * Payload user dari JWT yang sudah berhasil diverifikasi oleh
       * authentication middleware.
       */
      user?: JwtTokenPayload;
    }
  }
}

export {};
