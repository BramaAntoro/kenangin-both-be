import "dotenv/config";

/**
 * Mengambil nilai variable env yang tersedia
 * @param key - Nama variable dari env yang akan diambil
 * @returns Nilai variabel environment berupa string non-empty
 * @throws {Error} jika variabel env tidak tersedia atau kosong
 */
export default function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable : ${key}`);
  }

  return value;
}

export const HOST = getEnv("HOST");
export const PORT = getEnv("PORT");

export const NODE_ENV = getEnv("NODE_ENV")

export const JWT_SECRET = getEnv("JWT_SECRET")
export const AUTH_TOKEN_EXPIRES_IN_SECONDS = Number(getEnv("AUTH_TOKEN_EXPIRES_IN_SECONDS"))
export const JWT_ISSUER = getEnv("JWT_ISSUER")
export const JWT_AUDIENCE = getEnv("JWT_AUDIENCE")
