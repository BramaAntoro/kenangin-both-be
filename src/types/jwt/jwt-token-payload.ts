/**
 * Format payload yang disimpan di dalam JWT
 */
export type JwtTokenPayload = {
  id: string;
  email: string;
  name: string;
  role: string;
};
