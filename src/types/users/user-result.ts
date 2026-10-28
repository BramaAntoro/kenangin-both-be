/**
 * Format data user yang aman untuk dikembalikan ke client.
 */
export type UserResult = {
  id: string;
  name: string;
  email: string;
  accountNumber: string | null;
  bankName: string | null;
  role: string;
};
