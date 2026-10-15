/** Format data cafe yang dikembalikan ke client. */
export type CafeResult = {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  cafeSharePercent: number;
  kenanginSharePercent: number;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
