import bcrypt from "bcrypt";

/**
 * Membandingkan password plain text dengan password yang telah di-hash
 * menggunakan algoritma bcrypt.
 * @param inputPassword - Password plain text yang akan diverifikasi.
 * @param hashedPassword - Password bcrypt yang tersimpan.
 * @returns Promise yang menghasilkan `true` jika password cocok atau `false`
 * jika password tidak cocok.
 */
export default function comparePassword(
  inputPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(inputPassword, hashedPassword);
}
