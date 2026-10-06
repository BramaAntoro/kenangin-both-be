import { Router } from "express";
import createCafeAdminRoute from "./cafe-admin/route.js";
import requireRole from "../../middlewares/role.middleware.js";

/**
 * Router user untuk endpoint yang membutuhkan autentikasi.
 */
const usersProtectedRoute = Router();
usersProtectedRoute.use(requireRole("super_admin"));

usersProtectedRoute.use("/cafe-admin", createCafeAdminRoute);

export default usersProtectedRoute;
