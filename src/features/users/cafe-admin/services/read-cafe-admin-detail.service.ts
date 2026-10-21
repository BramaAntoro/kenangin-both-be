import readCafeAdminCafesRepository from "../repositories/read-cafe-admin-cafes.repository.js";

export default async function readCafeAdminDetailService(userId: string) {
  return readCafeAdminCafesRepository(userId);
}
