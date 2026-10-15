/**
 * Format data cafe admin yang ditampilkan pada endpoint read.
 */
export type ReadCafeAdminResult = {
  id: string;
  name: string;
  email: string;
  tanggalBergabung: Date | null;
};
