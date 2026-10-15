/**
 * Merepresentasikan error aplikasi yang memiliki HTTP status code.
 * Digunakan untuk menyampaikan error bisnis dari service ke layer API
 * agar dapat diubah menjadi respons HTTP yang sesuai.
 */
export default class AppError extends Error {
  /**
   * Membuat error aplikasi.
   * @param message - Pesan yang menjelaskan penyebab error.
   * @param statusCode - HTTP status code untuk respons error.
   */
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
