/**
 * Membuat kode kiosk otomatis berdasarkan nama cafe dan nomor urut.
 * Contoh: "CAFEE", 1 -> "KSK-CAFEE-1"
 *
 * @param cafeName - Nama cafe.
 * @param sequence - Nomor urut kiosk untuk cafe tersebut.
 * @returns Kode kiosk yang sudah diformat.
 */
export default function generateKioskCode(
  cafeName: string,
  sequence: number,
): string {
  const sanitizedCafeName =
    cafeName.toUpperCase().replace(/[^A-Z0-9]+/g, "");

  return `KSK-${sanitizedCafeName}-${sequence}`;
}
