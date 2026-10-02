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
