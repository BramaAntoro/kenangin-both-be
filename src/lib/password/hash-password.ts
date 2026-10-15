import bcrypt from "bcrypt";

/**
 * Melakukan hash pada password menggunakan algoritma bcrypt.
 * @param password - Plain text password yang dikirim oleh client.
 * @param saltRounds - Jumlah ronde salt untuk hashing (default: 10).
 * @returns String password yang telah di hash.
 */
export default async function hashPassword(
  password: string,
  saltRounds: number = 10,
): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}
