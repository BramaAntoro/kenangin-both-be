import type { UserResult } from "../../../types/users/user-result.js";
import type { CafeResult } from "./cafe-result.js";

/** Format hasil pembuatan cafe beserta admin yang direlasikan. */
export type CreateCafeResult = {
  cafe: CafeResult;
  cafeAdmin: UserResult;
};
