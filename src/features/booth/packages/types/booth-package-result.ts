/**
 * Format hasil data paket booth yang dikembalikan ke client.
 */
export type BoothPackageResult = {
  id: string;
  cafeId: string;
  name: string;
  price: number;
  photoShotsCount: number;
  printCopiesCount: number;
  features: unknown;
  description: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
